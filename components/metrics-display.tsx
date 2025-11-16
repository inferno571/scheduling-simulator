"use client"

import { Card } from "@/components/ui/card"

interface MetricsDisplayProps {
  algorithm: string
  seekTime: number
  sequence: number[]
}

export function MetricsDisplay({ algorithm, seekTime, sequence }: MetricsDisplayProps) {
  if (sequence.length === 0) return null

  const totalRequests = sequence.length - 1
  const avgSeekTime = seekTime / Math.max(1, totalRequests)

  // Calculate max and min seek times for a single step
  let maxSeekPerStep = 0
  let minSeekPerStep = Number.POSITIVE_INFINITY
  for (let i = 1; i < sequence.length; i++) {
    const seek = Math.abs(sequence[i] - sequence[i - 1])
    maxSeekPerStep = Math.max(maxSeekPerStep, seek)
    minSeekPerStep = Math.min(minSeekPerStep, seek)
  }
  if (minSeekPerStep === Number.POSITIVE_INFINITY) minSeekPerStep = 0

  // Calculate head movement range
  const minPosition = Math.min(...sequence)
  const maxPosition = Math.max(...sequence)
  const rangeSpan = maxPosition - minPosition

  return (
    <Card className="bg-card p-6 border-border">
      <h3 className="text-xl font-bold text-foreground mb-6">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Primary Metrics */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-4 rounded-lg border border-primary/30">
          <p className="text-muted-foreground text-sm mb-1">Algorithm</p>
          <p className="text-2xl font-bold text-primary">{algorithm}</p>
        </div>
        <div className="bg-gradient-to-br from-accent/20 to-primary/10 p-4 rounded-lg border border-accent/30">
          <p className="text-muted-foreground text-sm mb-1">Total Seek Time</p>
          <p className="text-2xl font-bold text-accent">{seekTime}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border">
          <p className="text-muted-foreground text-sm mb-1">Requests Served</p>
          <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border">
          <p className="text-muted-foreground text-sm mb-1">Avg Seek Time</p>
          <p className="text-2xl font-bold text-foreground">{avgSeekTime.toFixed(2)}</p>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Advanced Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
            <span className="text-sm text-muted-foreground">Max Single Seek</span>
            <span className="font-bold text-foreground">{maxSeekPerStep}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
            <span className="text-sm text-muted-foreground">Min Single Seek</span>
            <span className="font-bold text-foreground">{minSeekPerStep}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
            <span className="text-sm text-muted-foreground">Track Range Min</span>
            <span className="font-bold text-foreground">{minPosition}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
            <span className="text-sm text-muted-foreground">Track Range Max</span>
            <span className="font-bold text-foreground">{maxPosition}</span>
          </div>
          <div className="col-span-2 flex justify-between items-center p-3 bg-secondary/50 rounded">
            <span className="text-sm text-muted-foreground">Total Track Span</span>
            <span className="font-bold text-foreground">{rangeSpan}</span>
          </div>
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-foreground">Efficiency Score</span>
          <span className="text-xs text-muted-foreground">Based on average utilization</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
            style={{
              width: `${Math.max(20, Math.min(100, 100 - avgSeekTime / 10))}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Lower average seek times indicate better scheduling efficiency.
        </p>
      </div>
    </Card>
  )
}
