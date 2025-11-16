"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MemoryRequest {
  processId: string
  size: number
}

interface MemoryInputPanelProps {
  onSimulate: (
    totalMemory: number,
    requests: MemoryRequest[],
    algorithm: string,
    pageSize?: number
  ) => void
}

export function MemoryInputPanel({ onSimulate }: MemoryInputPanelProps) {
  const [algorithm, setAlgorithm] = useState("FirstFit")
  const [totalMemory, setTotalMemory] = useState(256)
  const [pageSize, setPageSize] = useState(16)
  const [requests, setRequests] = useState<MemoryRequest[]>([
    { processId: "P1", size: 40 },
    { processId: "P2", size: 60 },
    { processId: "P3", size: 35 },
    { processId: "P4", size: 50 },
  ])

  const handleAddRequest = () => {
    const newId = `P${requests.length + 1}`
    setRequests([...requests, { processId: newId, size: 20 }])
  }

  const handleRemoveRequest = (id: string) => {
    setRequests(requests.filter((r) => r.processId !== id))
  }

  const handleUpdateRequest = (id: string, field: keyof MemoryRequest, value: any) => {
    setRequests(requests.map((r) => (r.processId === id ? { ...r, [field]: value } : r)))
  }

  const handleRandomize = () => {
    const newRequests = requests.map((r) => ({
      ...r,
      size: Math.floor(Math.random() * 80) + 10,
    }))
    setRequests(newRequests)
  }

  const handleSimulate = () => {
    onSimulate(totalMemory, requests, algorithm, pageSize)
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
            <SelectItem value="FirstFit">First Fit</SelectItem>
            <SelectItem value="BestFit">Best Fit</SelectItem>
            <SelectItem value="WorstFit">Worst Fit</SelectItem>
            <SelectItem value="BuddySystem">Buddy System</SelectItem>
            <SelectItem value="Paging">Paging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Total Memory (KB)</Label>
        <Input
          type="number"
          min="64"
          max="1024"
          step="16"
          value={totalMemory}
          onChange={(e) => setTotalMemory(parseInt(e.target.value) || 256)}
        />
      </div>

      {algorithm === "Paging" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Page Size (KB)</Label>
          <Input
            type="number"
            min="4"
            max="64"
            step="4"
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value) || 16)}
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-foreground">Memory Requests</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRandomize}>
              Randomize
            </Button>
            <Button size="sm" onClick={handleAddRequest}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {requests.map((request) => (
            <div key={request.processId} className="bg-muted p-3 rounded-md space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{request.processId}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveRequest(request.processId)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
              <div>
                <Label className="text-xs">Size (KB)</Label>
                <Input
                  type="number"
                  min="1"
                  max="200"
                  value={request.size}
                  onChange={(e) => handleUpdateRequest(request.processId, "size", parseInt(e.target.value) || 1)}
                  className="h-8 text-sm"
                />
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
