"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Process } from "@/lib/cpu-scheduling-algorithms"

interface CPUInputPanelProps {
  onSimulate: (processes: Process[], algorithm: string, timeQuantum?: number) => void
}

export function CPUInputPanel({ onSimulate }: CPUInputPanelProps) {
  const [algorithm, setAlgorithm] = useState("FCFS")
  const [timeQuantum, setTimeQuantum] = useState(4)
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrivalTime: 0, burstTime: 8, priority: 3 },
    { id: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: "P3", arrivalTime: 2, burstTime: 2, priority: 2 },
    { id: "P4", arrivalTime: 3, burstTime: 6, priority: 2 },
  ])

  const handleAddProcess = () => {
    const newId = `P${processes.length + 1}`
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 1, priority: 2 },
    ])
  }

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const handleUpdateProcess = (id: string, field: keyof Process, value: any) => {
    setProcesses(processes.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleRandomize = () => {
    const newProcesses = processes.map((p) => ({
      ...p,
      arrivalTime: Math.floor(Math.random() * 5),
      burstTime: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 3) + 1,
    }))
    setProcesses(newProcesses)
  }

  const handleSimulate = () => {
    onSimulate(processes, algorithm, timeQuantum)
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Algorithm</h3>
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FCFS">FCFS</SelectItem>
            <SelectItem value="SJF">SJF</SelectItem>
            <SelectItem value="Priority">Priority</SelectItem>
            <SelectItem value="RoundRobin">Round Robin</SelectItem>
            <SelectItem value="SRTF">SRTF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {algorithm === "RoundRobin" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Time Quantum</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              max="10"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
              className="flex-1"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-foreground">Processes</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRandomize}>
              Randomize
            </Button>
            <Button size="sm" onClick={handleAddProcess}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {processes.map((process) => (
            <div key={process.id} className="bg-muted p-3 rounded-md space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{process.id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveProcess(process.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Arrival</Label>
                  <Input
                    type="number"
                    min="0"
                    value={process.arrivalTime}
                    onChange={(e) => handleUpdateProcess(process.id, "arrivalTime", parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Burst</Label>
                  <Input
                    type="number"
                    min="1"
                    value={process.burstTime}
                    onChange={(e) => handleUpdateProcess(process.id, "burstTime", parseInt(e.target.value) || 1)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={process.priority || 2}
                    onChange={(e) => handleUpdateProcess(process.id, "priority", parseInt(e.target.value) || 2)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSimulate} className="w-full" size="lg">
        Simulate
      </Button>
    </Card>
  )
}
