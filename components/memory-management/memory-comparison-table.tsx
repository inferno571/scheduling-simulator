"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import {
  firstFitAllocation,
  bestFitAllocation,
  worstFitAllocation,
  buddySystemAllocation,
  pagingAllocation,
} from "@/lib/memory-management-algorithms"

interface MemoryRequest {
  processId: string
  size: number
}

interface MemoryComparisonTableProps {
  totalMemory: number
  requests: MemoryRequest[]
  pageSize?: number
}

export function MemoryComparisonTable({ totalMemory, requests, pageSize = 16 }: MemoryComparisonTableProps) {
  const algorithms = [
    { name: "First Fit", fn: () => firstFitAllocation(totalMemory, requests) },
    { name: "Best Fit", fn: () => bestFitAllocation(totalMemory, requests) },
    { name: "Worst Fit", fn: () => worstFitAllocation(totalMemory, requests) },
    { name: "Buddy System", fn: () => buddySystemAllocation(totalMemory, requests) },
    { name: "Paging", fn: () => pagingAllocation(totalMemory, pageSize, requests) },
  ]

  const results = algorithms.map((algo) => ({
    name: algo.name,
    result: algo.fn(),
  }))

  const bestUtil = Math.max(...results.map((r) => r.result.memoryUtilization))
  const bestFrag = Math.min(...results.map((r) => r.result.externalFragmentation))

  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-foreground mb-4">Algorithm Comparison</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Algorithm</TableHead>
            <TableHead className="text-right">Allocated</TableHead>
            <TableHead className="text-right">External Frag</TableHead>
            <TableHead className="text-right">Internal Frag</TableHead>
            <TableHead className="text-right">Utilization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.name}>
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell className="text-right">
                {result.result.allocated ? "Yes" : "No"}
              </TableCell>
              <TableCell
                className={`text-right ${
                  result.result.externalFragmentation === bestFrag ? "font-bold text-green-600" : ""
                }`}
              >
                {result.result.externalFragmentation} KB
              </TableCell>
              <TableCell className="text-right">
                {result.result.internalFragmentation} KB
              </TableCell>
              <TableCell
                className={`text-right ${
                  result.result.memoryUtilization === bestUtil ? "font-bold text-green-600" : ""
                }`}
              >
                {result.result.memoryUtilization.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
