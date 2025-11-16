"use client"

import { useState } from "react"
import { InputPanel } from "@/components/input-panel"
import { Visualization } from "@/components/visualization"
import { MetricsDisplay } from "@/components/metrics-display"
import { ComparisonTable } from "@/components/comparison-table"
import { TerminalAnalyzer } from "@/components/terminal-analyzer"
import { fcfs, sstf, scan, cscan, look, clook } from "@/lib/scheduling-algorithms"
import { parseDiskAnalysisData } from "@/lib/ai-data-parser"

export function DiskSchedulingSection() {
  const [sequence, setSequence] = useState<number[]>([])
  const [seekTime, setSeekTime] = useState(0)
  const [algorithm, setAlgorithm] = useState("")
  const [requests, setRequests] = useState<number[]>([])
  const [headPosition, setHeadPosition] = useState(0)

  const handleSimulate = (reqs: number[], head: number, algo: string) => {
    setRequests(reqs)
    setHeadPosition(head)
    setAlgorithm(algo)

    let result
    switch (algo) {
      case "FCFS":
        result = fcfs(reqs, head)
        break
      case "SSTF":
        result = sstf(reqs, head)
        break
      case "SCAN":
        result = scan(reqs, head)
        break
      case "C-SCAN":
        result = cscan(reqs, head)
        break
      case "LOOK":
        result = look(reqs, head)
        break
      case "C-LOOK":
        result = clook(reqs, head)
        break
      default:
        result = fcfs(reqs, head)
    }

    setSequence(result.sequence)
    setSeekTime(result.totalSeekTime)
  }

  const handleAIAnalysis = (data: any) => {
    const parsed = parseDiskAnalysisData(data)
    if (parsed.requests.length > 0) {
      setRequests(parsed.requests)
      setHeadPosition(parsed.headPosition)
      // Auto-simulate with FCFS as default
      handleSimulate(parsed.requests, parsed.headPosition, "FCFS")
    }
  }

  return (
    <div className="space-y-6">
      <TerminalAnalyzer analysisType="disk" onAnalysisComplete={handleAIAnalysis} />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InputPanel onSimulate={handleSimulate} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Visualization sequence={sequence} algorithm={algorithm} />
          <MetricsDisplay algorithm={algorithm} seekTime={seekTime} sequence={sequence} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <ComparisonTable requests={requests} headPosition={headPosition} />

          {sequence.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">About {algorithm}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getAlgorithmDescription(algorithm)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getAlgorithmDescription(algo: string): string {
  const descriptions: Record<string, string> = {
    FCFS: "First Come First Served (FCFS) processes requests in the order they arrive. While simple to implement, it can result in high seek times when requests are scattered across the disk.",
    SSTF: "Shortest Seek Time First (SSTF) selects the request with the minimum seek time from the current head position. This can cause starvation and doesn't prevent the head from moving back and forth excessively.",
    SCAN: "SCAN (Elevator Algorithm) moves the head in one direction until it reaches the end, then reverses direction. This prevents starvation and provides consistent performance across different workloads.",
    "C-SCAN":
      "Circular SCAN (C-SCAN) improves upon SCAN by returning to one end of the disk and scanning again, rather than reversing direction. This provides more uniform wait times for requests.",
    LOOK: "LOOK is similar to SCAN but moves only to the furthest request in each direction instead of going all the way to the disk ends, reducing unnecessary seek time.",
    "C-LOOK":
      "Circular LOOK improves C-SCAN by only servicing requests up to the furthest request in each direction, then jumping to the other side. This minimizes wasted head movement.",
  }
  return descriptions[algo] || "Algorithm description not available."
}
