"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface InputPanelProps {
  onSimulate: (requests: number[], headPosition: number, algorithm: string) => void
}

const ALGORITHMS = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]

export function InputPanel({ onSimulate }: InputPanelProps) {
  const [requests, setRequests] = useState("10,20,30,40,50,60")
  const [headPosition, setHeadPosition] = useState("0")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FCFS")

  const generateRandom = () => {
    const randomRequests = Array.from({ length: 6 }, () => Math.floor(Math.random() * 200)).join(",")
    setRequests(randomRequests)
  }

  const handleSimulate = () => {
    const requestArray = requests
      .split(",")
      .map((r) => Number.parseInt(r.trim()))
      .filter((r) => !isNaN(r))
    const head = Number.parseInt(headPosition)

    if (requestArray.length === 0 || isNaN(head)) {
      alert("Please enter valid requests and head position")
      return
    }

    onSimulate(requestArray, head, selectedAlgorithm)
  }

  return (
    <Card className="bg-card p-6 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Disk Scheduler Input</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="requests" className="text-foreground mb-2 block">
            Disk Track Requests (comma-separated)
          </Label>
          <Input
            id="requests"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="10,20,30,40,50"
            className="bg-input border-border text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="head" className="text-foreground mb-2 block">
            Initial Head Position
          </Label>
          <Input
            id="head"
            type="number"
            value={headPosition}
            onChange={(e) => setHeadPosition(e.target.value)}
            placeholder="0"
            className="bg-input border-border text-foreground"
          />
        </div>

        <div>
          <Label className="text-foreground mb-3 block">Select Algorithm</Label>
          <div className="grid grid-cols-2 gap-2">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                onClick={() => setSelectedAlgorithm(algo)}
                className={`px-4 py-2 rounded transition ${
                  selectedAlgorithm === algo
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSimulate} className="flex-1 bg-primary hover:bg-accent text-primary-foreground">
            Simulate
          </Button>
          <Button onClick={generateRandom} className="flex-1 bg-secondary hover:bg-muted text-secondary-foreground">
            Random Input
          </Button>
        </div>
      </div>
    </Card>
  )
}
