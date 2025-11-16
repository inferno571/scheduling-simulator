"use client"

import { useState } from "react"
import { MemoryInputPanel } from "@/components/memory-management/memory-input-panel"
import { MemoryVisualization } from "@/components/memory-management/memory-visualization"
import { MemoryMetrics } from "@/components/memory-management/memory-metrics"
import { MemoryComparisonTable } from "@/components/memory-management/memory-comparison-table"
import { TerminalAnalyzer } from "@/components/terminal-analyzer"
import type { MemoryBlock, MemoryAllocationResult } from "@/lib/memory-management-algorithms"
import {
  firstFitAllocation,
  bestFitAllocation,
  worstFitAllocation,
  buddySystemAllocation,
  pagingAllocation,
} from "@/lib/memory-management-algorithms"
import { parseMemoryAnalysisData } from "@/lib/ai-data-parser"

interface MemoryRequest {
  processId: string
  size: number
}

export function MemoryManagementSection() {
  const [result, setResult] = useState<MemoryAllocationResult | null>(null)
  const [algorithm, setAlgorithm] = useState("")
  const [requests, setRequests] = useState<MemoryRequest[]>([])
  const [totalMemory, setTotalMemory] = useState(256)

  const handleSimulate = (
    memory: number,
    reqs: MemoryRequest[],
    algo: string,
    pageSize?: number
  ) => {
    setTotalMemory(memory)
    setRequests(reqs)
    setAlgorithm(algo)

    let result
    switch (algo) {
      case "FirstFit":
        result = firstFitAllocation(memory, reqs)
        break
      case "BestFit":
        result = bestFitAllocation(memory, reqs)
        break
      case "WorstFit":
        result = worstFitAllocation(memory, reqs)
        break
      case "BuddySystem":
        result = buddySystemAllocation(memory, reqs)
        break
      case "Paging":
        result = pagingAllocation(memory, pageSize || 16, reqs)
        break
      default:
        result = firstFitAllocation(memory, reqs)
    }

    setResult(result)
  }

  const handleAIAnalysis = (data: any) => {
    const parsed = parseMemoryAnalysisData(data)
    if (parsed.requests.length > 0) {
      setTotalMemory(parsed.totalMemory)
      setRequests(parsed.requests)
      // Auto-simulate with FirstFit as default
      handleSimulate(parsed.totalMemory, parsed.requests, "FirstFit", parsed.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      <TerminalAnalyzer analysisType="memory" onAnalysisComplete={handleAIAnalysis} />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MemoryInputPanel onSimulate={handleSimulate} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MemoryVisualization blocks={result?.blocks || []} algorithm={algorithm} totalMemory={totalMemory} />
          <MemoryMetrics result={result || null} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <MemoryComparisonTable totalMemory={totalMemory} requests={requests} />

          {result && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">About {algorithm}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getMemoryAlgorithmDescription(algorithm)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getMemoryAlgorithmDescription(algo: string): string {
  const descriptions: Record<string, string> = {
    FirstFit: "First Fit allocates the first free block that is large enough for the process. It's fast but can lead to significant external fragmentation over time.",
    BestFit: "Best Fit allocates the smallest free block that fits the process. This reduces waste but requires scanning all free blocks and still leads to fragmentation.",
    WorstFit: "Worst Fit allocates the largest free block available. This leaves larger free blocks for future processes but increases fragmentation.",
    BuddySystem: "Buddy System divides memory into power-of-2 sized blocks. It reduces fragmentation and makes deallocation easier through buddy coalescing.",
    Paging: "Paging divides physical memory into fixed-size pages. It eliminates external fragmentation and allows non-contiguous memory allocation, though it can cause internal fragmentation.",
  }
  return descriptions[algo] || "Algorithm description not available."
}
