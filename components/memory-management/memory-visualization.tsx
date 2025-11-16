"use client"

import { Card } from "@/components/ui/card"
import type { MemoryBlock } from "@/lib/memory-management-algorithms"

interface MemoryVisualizationProps {
  blocks: MemoryBlock[]
  algorithm: string
  totalMemory: number
}

export function MemoryVisualization({ blocks, algorithm, totalMemory }: MemoryVisualizationProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center py-8">
          Run a simulation to visualize memory allocation
        </p>
      </Card>
    )
  }

  const colors = {
    P1: "#3b82f6",
    P2: "#8b5cf6",
    P3: "#ec4899",
    P4: "#f59e0b",
    P5: "#10b981",
    P6: "#06b6d4",
  }

  const getColor = (processId?: string) => {
    if (!processId) return "#e5e7eb"
    return (colors as any)[processId] || "#94a3b8"
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{algorithm} - Memory Layout</h3>
        <div className="space-y-2">
          {blocks.map((block, idx) => {
            const width = (block.size / totalMemory) * 100
            return (
              <div key={idx} className="space-y-1">
                <div
                  className="h-12 rounded border border-border flex items-center justify-center text-xs font-semibold transition-all hover:shadow-md"
                  style={{
                    backgroundColor: getColor(block.processId),
                    opacity: block.isFree ? 0.3 : 1,
                  }}
                  title={`${block.processId || "Free"}: ${block.startAddress}-${block.startAddress + block.size} (${block.size}KB)`}
                >
                  <span className="text-white drop-shadow">
                    {block.processId || "Free"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between px-2">
                  <span>{block.startAddress}</span>
                  <span>{block.size}KB</span>
                  <span>{block.startAddress + block.size}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-md">
          <p className="text-xs font-medium text-muted-foreground mb-2">Total Memory Used</p>
          <p className="text-2xl font-bold text-foreground">
            {blocks.reduce((sum, b) => (b.processId ? sum + b.size : sum), 0)}
            <span className="text-sm text-muted-foreground ml-1">KB</span>
          </p>
        </div>
        <div className="bg-muted p-4 rounded-md">
          <p className="text-xs font-medium text-muted-foreground mb-2">Free Space</p>
          <p className="text-2xl font-bold text-foreground">
            {blocks.reduce((sum, b) => (b.isFree ? sum + b.size : sum), 0)}
            <span className="text-sm text-muted-foreground ml-1">KB</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
