import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "") {
      console.error("GEMINI_API_KEY is not configured")
      return NextResponse.json(
        { 
          error: "GEMINI_API_KEY is not configured. Please set it in your .env.local file.",
          details: "Get your API key from: https://makersuite.google.com/app/apikey"
        },
        { status: 500 }
      )
    }

    const { command, output, analysisType } = await request.json()

    if (!command || !output) {
      return NextResponse.json(
        { error: "Command and output are required" },
        { status: 400 }
      )
    }

    if (!analysisType || !["cpu", "memory", "disk"].includes(analysisType)) {
      return NextResponse.json(
        { error: "Invalid analysis type. Must be 'cpu', 'memory', or 'disk'" },
        { status: 400 }
      )
    }

    // Initialize Gemini AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })

    // Create a prompt based on the analysis type
    let systemPrompt = ""
    let jsonSchema = ""

    switch (analysisType) {
      case "cpu":
        systemPrompt = `Analyze the Linux terminal command output and extract CPU scheduling information. 
        Look for process information, CPU usage, process IDs, execution times, priorities, or any scheduling-related data.
        Extract process details like: process IDs, arrival times, burst times, priorities, CPU utilization, etc.`
        jsonSchema = `{
          "processes": [
            {
              "id": "string (process name or ID)",
              "arrivalTime": "number (arrival time in seconds)",
              "burstTime": "number (execution time in seconds)",
              "priority": "number (optional, lower is higher priority)"
            }
          ],
          "cpuUtilization": "number (percentage, 0-100)",
          "notes": "string (any relevant observations)"
        }`
        break

      case "memory":
        systemPrompt = `Analyze the Linux terminal command output and extract memory management information.
        Look for memory usage, process memory allocations, page sizes, memory blocks, fragmentation, or any memory-related data.
        Extract memory details like: process IDs, memory sizes, total memory, page sizes, allocation patterns, etc.`
        jsonSchema = `{
          "totalMemory": "number (total memory in MB)",
          "requests": [
            {
              "processId": "string (process name or ID)",
              "size": "number (memory size in MB)"
            }
          ],
          "pageSize": "number (optional, page size in MB if paging is relevant)",
          "notes": "string (any relevant observations)"
        }`
        break

      case "disk":
        systemPrompt = `Analyze the Linux terminal command output and extract disk scheduling information.
        Look for disk I/O operations, track numbers, sector numbers, disk requests, seek operations, or any disk-related data.
        Extract disk details like: track/sector numbers, head position, disk requests, I/O operations, etc.`
        jsonSchema = `{
          "requests": [number] (array of track/sector numbers or disk request positions),
          "headPosition": "number (current head position, default to first request if not found)",
          "diskSize": "number (optional, total disk size in tracks/sectors)",
          "notes": "string (any relevant observations)"
        }`
        break

      default:
        return NextResponse.json(
          { error: "Invalid analysis type. Must be 'cpu', 'memory', or 'disk'" },
          { status: 400 }
        )
    }

    const prompt = `${systemPrompt}

Command executed: ${command}

Command output:
${output}

Please analyze this output and extract relevant information for ${analysisType} scheduling simulation.
Return ONLY a valid JSON object matching this schema:
${jsonSchema}

Important:
- Return ONLY the JSON object, no markdown, no code blocks, no explanations
- Use reasonable defaults if exact values are not found
- Ensure all numbers are valid (no NaN, no null for required fields)
- If you cannot extract meaningful data, return empty arrays/objects with default values`

    let result
    let response
    let text
    
    try {
      result = await model.generateContent(prompt)
      response = await result.response
      text = response.text()
      
      if (!text || text.trim() === "") {
        throw new Error("Empty response from Gemini API")
      }
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError)
      return NextResponse.json(
        {
          error: "Failed to get response from Gemini API",
          message: apiError.message || "Unknown API error",
          details: apiError.cause || "Check your API key and network connection"
        },
        { status: 500 }
      )
    }

    // Try to extract JSON from the response (handle markdown code blocks if present)
    let jsonText = text.trim()
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "")
    }

    // Parse the JSON
    let parsedData
    try {
      parsedData = JSON.parse(jsonText)
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Could not parse JSON from response")
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      rawResponse: text,
    })
  } catch (error: any) {
    console.error("Error analyzing terminal output:", error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Failed to parse request JSON",
          message: error.message,
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to analyze terminal output",
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

