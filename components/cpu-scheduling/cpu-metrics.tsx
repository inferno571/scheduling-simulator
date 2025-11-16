"use client"

import { Card } from "@/components/ui/card"
import type { CPUSchedulingResult } from "@/lib/cpu-scheduling-algorithms"

interface CPUMetricsProps {
  result: CPUSchedulingResult | null
}

export function CPUMetrics({ result }: CPUMetricsProps) {
  if (!result) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No data available</p>
      </Card>
    )
  }

  const metrics = [
    {
      label: "Average Waiting Time",
      value: result.avgWaitingTime.toFixed(2),
      unit: "units",
    },
    {
      label: "Average Turnaround Time",
      value: result.avgTurnaroundTime.toFixed(2),
      unit: "units",
    },
    {
      label: "CPU Utilization",
      value: result.cpuUtilization.toFixed(2),
      unit: "%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">{metric.label}</p>
          <p className="text-3xl font-bold text-foreground">
            {metric.value}
            <span className="text-lg text-muted-foreground ml-1">{metric.unit}</span>
          </p>
        </Card>
      ))}
    </div>
  )
}
