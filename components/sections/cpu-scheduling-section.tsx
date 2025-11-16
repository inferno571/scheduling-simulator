"use client"

import { useState } from "react"
import { CPUInputPanel } from "@/components/cpu-scheduling/cpu-input-panel"
import { CPUVisualization } from "@/components/cpu-scheduling/cpu-visualization"
import { CPUMetrics } from "@/components/cpu-scheduling/cpu-metrics"
import { CPUComparisonTable } from "@/components/cpu-scheduling/cpu-comparison-table"
import { TerminalAnalyzer } from "@/components/terminal-analyzer"
import type { Process, CPUSchedulingResult } from "@/lib/cpu-scheduling-algorithms"
import {
  fcfsScheduling,
  sjfScheduling,
  priorityScheduling,
  roundRobinScheduling,
  srtfScheduling,
} from "@/lib/cpu-scheduling-algorithms"
import { parseCPUAnalysisData } from "@/lib/ai-data-parser"

export function CPUSchedulingSection() {
  const [result, setResult] = useState<CPUSchedulingResult | null>(null)
  const [algorithm, setAlgorithm] = useState("")
  const [processes, setProcesses] = useState<Process[]>([])
  const [timeQuantum, setTimeQuantum] = useState(4)

  const handleSimulate = (procs: Process[], algo: string, quantum?: number) => {
    setProcesses(procs)
    setAlgorithm(algo)
    if (quantum) setTimeQuantum(quantum)

    let result
    switch (algo) {
      case "FCFS":
        result = fcfsScheduling(procs)
        break
      case "SJF":
        result = sjfScheduling(procs)
        break
      case "Priority":
        result = priorityScheduling(procs)
        break
      case "RoundRobin":
        result = roundRobinScheduling(procs, quantum || 4)
        break
      case "SRTF":
        result = srtfScheduling(procs)
        break
      default:
        result = fcfsScheduling(procs)
    }

    setResult(result)
  }

  const handleAIAnalysis = (data: any) => {
    const parsedProcesses = parseCPUAnalysisData(data)
    if (parsedProcesses.length > 0) {
      setProcesses(parsedProcesses)
      // Auto-simulate with FCFS as default
      handleSimulate(parsedProcesses, "FCFS", 4)
    }
  }

  return (
    <div className="space-y-6">
      <TerminalAnalyzer analysisType="cpu" onAnalysisComplete={handleAIAnalysis} />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CPUInputPanel onSimulate={handleSimulate} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CPUVisualization result={result} algorithm={algorithm} />
          <CPUMetrics result={result} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <CPUComparisonTable processes={processes} timeQuantum={timeQuantum} />

          {result && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">About {algorithm}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getCPUAlgorithmDescription(algorithm)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getCPUAlgorithmDescription(algo: string): string {
  const descriptions: Record<string, string> = {
    FCFS: "First Come First Served (FCFS) executes processes in the order they arrive. Simple to implement but can cause long wait times for subsequent processes if an earlier process has a long burst time.",
    SJF: "Shortest Job First (SJF) executes the process with the shortest burst time next. This minimizes average waiting time but can cause starvation of longer processes and requires advance knowledge of burst times.",
    Priority: "Priority Scheduling assigns each process a priority level and executes higher priority processes first. Processes with lower priority may starve if high-priority processes keep arriving.",
    RoundRobin: "Round Robin allocates a fixed time quantum to each process and cycles through them. This provides fair CPU distribution and prevents any process from monopolizing the CPU.",
    SRTF: "Shortest Remaining Time First (SRTF) is a preemptive version of SJF that switches to the process with the shortest remaining burst time. It minimizes waiting time but has high context-switching overhead.",
  }
  return descriptions[algo] || "Algorithm description not available."
}
