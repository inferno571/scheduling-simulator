"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { fcfs, sstf, scan, cscan, look, clook, type SchedulingResult } from "@/lib/scheduling-algorithms"

interface ComparisonTableProps {
  requests: number[]
  headPosition: number
}

type SortField = "algorithm" | "seekTime" | "avgSeekTime"
type SortOrder = "asc" | "desc"

export function ComparisonTable({ requests, headPosition }: ComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>("seekTime")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  if (requests.length === 0) return null

  const results: SchedulingResult[] = [
    fcfs(requests, headPosition),
    sstf(requests, headPosition),
    scan(requests, headPosition),
    cscan(requests, headPosition),
    look(requests, headPosition),
    clook(requests, headPosition),
  ]

  const minSeekTime = Math.min(...results.map((r) => r.totalSeekTime))
  const maxSeekTime = Math.max(...results.map((r) => r.totalSeekTime))

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    let aValue: number, bValue: number

    if (sortField === "algorithm") {
      return sortOrder === "asc" ? a.algorithm.localeCompare(b.algorithm) : b.algorithm.localeCompare(a.algorithm)
    } else if (sortField === "seekTime") {
      aValue = a.totalSeekTime
      bValue = b.totalSeekTime
    } else {
      aValue = a.totalSeekTime / Math.max(1, a.sequence.length - 1)
      bValue = b.totalSeekTime / Math.max(1, b.sequence.length - 1)
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue
  })

  const getPerformancePercentage = (seekTime: number) => {
    if (maxSeekTime === minSeekTime) return 0
    return ((maxSeekTime - seekTime) / (maxSeekTime - minSeekTime)) * 100
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-muted-foreground ml-1">⇅</span>
    return <span className="text-primary ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <Card className="bg-card p-6 border-border">
      <h3 className="text-xl font-bold text-foreground mb-4">Comparative Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th
                onClick={() => handleSort("algorithm")}
                className="text-left py-3 px-4 text-muted-foreground font-semibold cursor-pointer hover:text-foreground transition"
              >
                Algorithm
                <SortIndicator field="algorithm" />
              </th>
              <th
                onClick={() => handleSort("seekTime")}
                className="text-right py-3 px-4 text-muted-foreground font-semibold cursor-pointer hover:text-foreground transition"
              >
                Total Seek Time
                <SortIndicator field="seekTime" />
              </th>
              <th
                onClick={() => handleSort("avgSeekTime")}
                className="text-right py-3 px-4 text-muted-foreground font-semibold cursor-pointer hover:text-foreground transition"
              >
                Avg Seek Time
                <SortIndicator field="avgSeekTime" />
              </th>
              <th className="text-right py-3 px-4 text-muted-foreground font-semibold">Performance</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => (
              <tr
                key={result.algorithm}
                className={`border-b border-border transition ${
                  result.totalSeekTime === minSeekTime ? "bg-secondary/30" : ""
                }`}
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-foreground">{result.algorithm}</span>
                  {result.totalSeekTime === minSeekTime && (
                    <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Optimal</span>
                  )}
                </td>
                <td className="text-right py-3 px-4 text-foreground font-semibold">{result.totalSeekTime}</td>
                <td className="text-right py-3 px-4 text-muted-foreground">
                  {(result.totalSeekTime / Math.max(1, result.sequence.length - 1)).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                        style={{ width: `${getPerformancePercentage(result.totalSeekTime)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.round(getPerformancePercentage(result.totalSeekTime))}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Click column headers to sort. Performance is calculated relative to the worst-performing algorithm (100% =
        best).
      </p>
    </Card>
  )
}
