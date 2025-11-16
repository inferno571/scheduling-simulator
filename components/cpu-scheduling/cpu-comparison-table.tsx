"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import type { Process } from "@/lib/cpu-scheduling-algorithms"
import {
  fcfsScheduling,
  sjfScheduling,
  priorityScheduling,
  roundRobinScheduling,
  srtfScheduling,
} from "@/lib/cpu-scheduling-algorithms"

interface CPUComparisonTableProps {
  processes: Process[]
  timeQuantum?: number
}

export function CPUComparisonTable({ processes, timeQuantum = 4 }: CPUComparisonTableProps) {
  if (processes.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Algorithm Comparison</h3>
        <p className="text-muted-foreground">Add processes and click Simulate to see results.</p>
      </Card>
    )
  }

  const algorithms = [
    { name: "FCFS", fn: () => fcfsScheduling(processes) },
    { name: "SJF", fn: () => sjfScheduling(processes) },
    { name: "Priority", fn: () => priorityScheduling(processes) },
    { name: "Round Robin", fn: () => roundRobinScheduling(processes, timeQuantum) },
    { name: "SRTF", fn: () => srtfScheduling(processes) },
  ]

  const results = algorithms.map((algo) => ({
    name: algo.name,
    result: algo.fn(),
  }))

  const bestAvgWaiting = Math.min(...results.map((r) => r.result.avgWaitingTime))
  const bestAvgTurnaround = Math.min(...results.map((r) => r.result.avgTurnaroundTime))

  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-foreground mb-4">Algorithm Comparison</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Algorithm</TableHead>
            <TableHead className="text-right">Avg Waiting Time</TableHead>
            <TableHead className="text-right">Avg Turnaround Time</TableHead>
            <TableHead className="text-right">CPU Utilization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.name}>
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell
                className={`text-right ${
                  result.result.avgWaitingTime === bestAvgWaiting ? "font-bold text-green-600" : ""
                }`}
              >
                {result.result.avgWaitingTime.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-right ${
                  result.result.avgTurnaroundTime === bestAvgTurnaround ? "font-bold text-green-600" : ""
                }`}
              >
                {result.result.avgTurnaroundTime.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{result.result.cpuUtilization.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
