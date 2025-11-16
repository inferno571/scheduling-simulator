"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Terminal, Sparkles } from "lucide-react"

interface TerminalAnalyzerProps {
  analysisType: "cpu" | "memory" | "disk"
  onAnalysisComplete: (data: any) => void
}

export function TerminalAnalyzer({ analysisType, onAnalysisComplete }: TerminalAnalyzerProps) {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAnalyze = async () => {
    if (!command.trim() || !output.trim()) {
      setError("Please provide both command and output")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/analyze-terminal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command.trim(),
          output: output.trim(),
          analysisType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = result.error || "Failed to analyze terminal output"
        const details = result.details ? `\n\n${result.details}` : ""
        const message = result.message ? `\n\n${result.message}` : ""
        throw new Error(`${errorMsg}${message}${details}`)
      }

      if (result.success && result.data) {
        setSuccess(true)
        onAnalysisComplete(result.data)
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err: any) {
      // Format error message for better display
      let errorMessage = err.message || "An error occurred while analyzing the output"
      
      // Check if it's an API key error
      if (errorMessage.includes("GEMINI_API_KEY")) {
        errorMessage = "API Key Not Configured\n\nPlease set GEMINI_API_KEY in your .env.local file.\nGet your API key from: https://makersuite.google.com/app/apikey"
      }
      
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getPlaceholder = () => {
    switch (analysisType) {
      case "cpu":
        return "e.g., ps aux, top, htop, or any command showing process information"
      case "memory":
        return "e.g., free -h, ps aux --sort=-%mem, cat /proc/meminfo, or any memory-related command"
      case "disk":
        return "e.g., iostat, iotop, lsblk, df -h, or any disk I/O related command"
      default:
        return "Enter a Linux terminal command"
    }
  }

  const getOutputPlaceholder = () => {
    switch (analysisType) {
      case "cpu":
        return "Paste the command output here. The AI will extract process IDs, execution times, priorities, etc."
      case "memory":
        return "Paste the command output here. The AI will extract memory sizes, allocations, page information, etc."
      case "disk":
        return "Paste the command output here. The AI will extract disk tracks, sectors, I/O operations, etc."
      default:
        return "Paste the command output here"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Terminal Analyzer</CardTitle>
        </div>
        <CardDescription>
          Enter a Linux terminal command and its output. AI will analyze it and extract data for{" "}
          {analysisType} scheduling simulation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="command">Linux Command</Label>
          <div className="flex gap-2">
            <Terminal className="h-4 w-4 mt-2 text-muted-foreground" />
            <Input
              id="command"
              placeholder={getPlaceholder()}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="output">Command Output</Label>
          <Textarea
            id="output"
            placeholder={getOutputPlaceholder()}
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            disabled={isAnalyzing}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Successfully analyzed! Data has been loaded into the simulator.</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !command.trim() || !output.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p className="font-semibold mb-1">How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Run a Linux command on your system (e.g., <code className="bg-muted px-1 rounded">ps aux</code>)</li>
            <li>Copy the command output and paste it above</li>
            <li>Click "Analyze with AI" to extract scheduling data</li>
            <li>The extracted data will be automatically loaded into the simulator</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

