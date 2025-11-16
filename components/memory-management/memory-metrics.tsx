"use client"

import { Card } from "@/components/ui/card"
import type { MemoryAllocationResult } from "@/lib/memory-management-algorithms"

interface MemoryMetricsProps {
  result: MemoryAllocationResult | null
}

export function MemoryMetrics({ result }: MemoryMetricsProps) {
  if (!result) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No data available</p>
      </Card>
    )
  }

  const metrics = [
    {
      label: "External Fragmentation",
      value: result.externalFragmentation,
      unit: "KB",
      description: "Free space scattered in gaps",
    },
    {
      label: "Internal Fragmentation",
      value: result.internalFragmentation,
      unit: "KB",
      description: "Wasted space within blocks",
    },
    {
      label: "Memory Utilization",
      value: result.memoryUtilization.toFixed(2),
      unit: "%",
      description: "Percentage of memory used",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="p-6">
          <p className="text-xs font-medium text-muted-foreground mb-1">{metric.label}</p>
          <p className="text-3xl font-bold text-foreground mb-2">
            {metric.value}
            <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
          </p>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </Card>
      ))}
    </div>
  )
}
