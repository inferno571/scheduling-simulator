"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiskSchedulingSection } from "./sections/disk-scheduling-section"
import { CPUSchedulingSection } from "./sections/cpu-scheduling-section"
import { MemoryManagementSection } from "./sections/memory-management-section"

export function SchedulerTabs() {
  return (
    <Tabs defaultValue="disk" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="disk" className="text-sm md:text-base">
          Disk Scheduling
        </TabsTrigger>
        <TabsTrigger value="cpu" className="text-sm md:text-base">
          CPU Scheduling
        </TabsTrigger>
        <TabsTrigger value="memory" className="text-sm md:text-base">
          Memory Management
        </TabsTrigger>
      </TabsList>

      <TabsContent value="disk" className="space-y-6">
        <DiskSchedulingSection />
      </TabsContent>

      <TabsContent value="cpu" className="space-y-6">
        <CPUSchedulingSection />
      </TabsContent>

      <TabsContent value="memory" className="space-y-6">
        <MemoryManagementSection />
      </TabsContent>
    </Tabs>
  )
}
