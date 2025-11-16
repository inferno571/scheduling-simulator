"use client"

import { SchedulerTabs } from "@/components/scheduler-tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 pb-6 border-b border-border">
          <h1 className="text-4xl font-bold text-foreground mb-2">OSSP Scheduling algorithms simulator 
</h1>
          <p className="text-muted-foreground text-lg">
            Simulate and compare disk scheduling, CPU scheduling, and memory management algorithms with real-time visualizations and detailed performance metrics
          </p>
        </div>

        <SchedulerTabs />
      </div>
    </main>
  )
}
