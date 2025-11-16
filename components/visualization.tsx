"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface VisualizationProps {
  sequence: number[]
  algorithm: string
}

export function Visualization({ sequence, algorithm }: VisualizationProps) {
  const [data, setData] = useState<any[]>([])
  const [seekData, setSeekData] = useState<any[]>([])
  const [activeChart, setActiveChart] = useState<"movement" | "seek" | "scatter">("movement")

  useEffect(() => {
    // Movement chart data
    const chartData = sequence.map((position, index) => ({
      step: index,
      position: position,
      label: `Step ${index}`,
    }))
    setData(chartData)

    // Seek time per step chart data
    const seekTimes: any[] = []
    for (let i = 1; i < sequence.length; i++) {
      const seek = Math.abs(sequence[i] - sequence[i - 1])
      seekTimes.push({
        step: i - 1,
        seek: seek,
        label: `${sequence[i - 1]} → ${sequence[i]}`,
      })
    }
    setSeekData(seekTimes)
  }, [sequence])

  if (sequence.length === 0) {
    return (
      <Card className="bg-card p-6 border-border flex items-center justify-center h-96">
        <p className="text-muted-foreground">Run a simulation to see visualization</p>
      </Card>
    )
  }

  return (
    <Card className="bg-card p-6 border-border">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-4">{algorithm} - Visualization</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setActiveChart("movement")}
            variant={activeChart === "movement" ? "default" : "outline"}
            className={`text-sm ${
              activeChart === "movement"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            Head Movement
          </Button>
          <Button
            onClick={() => setActiveChart("seek")}
            variant={activeChart === "seek" ? "default" : "outline"}
            className={`text-sm ${
              activeChart === "seek"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            Seek Times
          </Button>
          <Button
            onClick={() => setActiveChart("scatter")}
            variant={activeChart === "scatter" ? "default" : "outline"}
            className={`text-sm ${
              activeChart === "scatter"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            Track Distribution
          </Button>
        </div>
      </div>

      {/* Head Movement Chart */}
      {activeChart === "movement" && (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="step" stroke="var(--muted-foreground)" />
              <YAxis
                stroke="var(--muted-foreground)"
                label={{ value: "Track Position", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="position"
                stroke="var(--primary)"
                dot={{ fill: "var(--accent)", r: 4 }}
                activeDot={{ r: 6 }}
                name="Head Position"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Shows the movement of the disk head across different tracks during scheduling.
          </p>
        </div>
      )}

      {/* Seek Time per Step Chart */}
      {activeChart === "seek" && (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seekData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="step" stroke="var(--muted-foreground)" />
              <YAxis
                stroke="var(--muted-foreground)"
                label={{ value: "Seek Time", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="seek" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Seek Time" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Shows the seek time required for each movement step between consecutive tracks.
          </p>
        </div>
      )}

      {/* Track Distribution Scatter Chart */}
      {activeChart === "scatter" && (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" dataKey="step" name="Step" stroke="var(--muted-foreground)" />
              <YAxis type="number" dataKey="position" name="Track" stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  color: "var(--foreground)",
                }}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter name="Track Visits" data={data} fill="var(--primary)" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Shows the distribution of track visits throughout the scheduling sequence.
          </p>
        </div>
      )}
    </Card>
  )
}
