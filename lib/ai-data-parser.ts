import type { Process } from "./cpu-scheduling-algorithms"

interface CPUAnalysisData {
  processes?: Array<{
    id?: string
    arrivalTime?: number
    burstTime?: number
    priority?: number
  }>
  cpuUtilization?: number
  notes?: string
}

interface MemoryAnalysisData {
  totalMemory?: number
  requests?: Array<{
    processId?: string
    size?: number
  }>
  pageSize?: number
  notes?: string
}

interface DiskAnalysisData {
  requests?: number[]
  headPosition?: number
  diskSize?: number
  notes?: string
}

export function parseCPUAnalysisData(data: CPUAnalysisData): Process[] {
  if (!data.processes || !Array.isArray(data.processes)) {
    return []
  }

  return data.processes
    .map((p, index) => ({
      id: p.id || `P${index + 1}`,
      arrivalTime: Math.max(0, p.arrivalTime ?? index),
      burstTime: Math.max(1, p.burstTime ?? 1),
      priority: p.priority ?? 2,
    }))
    .filter((p) => p.burstTime > 0)
}

export function parseMemoryAnalysisData(data: MemoryAnalysisData): {
  totalMemory: number
  requests: Array<{ processId: string; size: number }>
  pageSize?: number
} {
  const requests =
    data.requests
      ?.map((r, index) => ({
        processId: r.processId || `P${index + 1}`,
        size: Math.max(1, r.size ?? 10),
      }))
      .filter((r) => r.size > 0) || []

  return {
    totalMemory: Math.max(64, data.totalMemory ?? 256),
    requests,
    pageSize: data.pageSize,
  }
}

export function parseDiskAnalysisData(data: DiskAnalysisData): {
  requests: number[]
  headPosition: number
} {
  const requests =
    data.requests
      ?.map((r) => Math.max(0, r))
      .filter((r) => !isNaN(r) && isFinite(r)) || []

  const headPosition = data.headPosition ?? (requests.length > 0 ? requests[0] : 0)

  return {
    requests: requests.length > 0 ? requests : [10, 20, 30, 40, 50],
    headPosition,
  }
}

