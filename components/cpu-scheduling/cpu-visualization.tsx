"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import type { CPUSchedulingResult } from "@/lib/cpu-scheduling-algorithms"

interface CPUVisualizationProps {
  result: CPUSchedulingResult | null
  algorithm: string
}

export function CPUVisualization({ result, algorithm }: CPUVisualizationProps) {
  if (!result || result.schedule.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center py-8">
          Run a simulation to visualize the CPU scheduling
        </p>
      </Card>
    )
  }

  const ganttData = result.schedule.map((item, idx) => ({
    name: `${item.startTime}-${item.endTime}`,
    [item.process]: item.endTime - item.startTime,
    startTime: item.startTime,
  }))

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Gantt Chart - {algorithm}</h3>
        <div className="bg-muted p-4 rounded-md overflow-x-auto">
          <div className="flex items-center h-12 gap-1" style={{ minWidth: "100%" }}>
            {result.schedule.map((item, idx) => {
              const width = ((item.endTime - item.startTime) / result.schedule[result.schedule.length - 1].endTime) * 100
              return (
                <div
                  key={idx}
                  className="h-full flex items-center justify-center text-xs font-semibold text-white rounded bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${width}%` }}
                  title={`${item.process}: ${item.startTime}-${item.endTime}`}
                >
                  {item.process}
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Total Time: 0 to {result.schedule[result.schedule.length - 1].endTime} units
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Waiting Times</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(result.waitingTimes).map(([process, time]) => ({ process, time }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="process" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Turnaround Times</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(result.turnaroundTimes).map(([process, time]) => ({ process, time }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="process" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
