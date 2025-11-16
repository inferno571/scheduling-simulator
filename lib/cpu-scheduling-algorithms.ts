export interface CPUSchedulingResult {
  schedule: { process: string; startTime: number; endTime: number }[]
  waitingTimes: Record<string, number>
  turnaroundTimes: Record<string, number>
  avgWaitingTime: number
  avgTurnaroundTime: number
  cpuUtilization: number
}

export interface Process {
  id: string
  arrivalTime: number
  burstTime: number
  priority?: number
}

// FCFS: First Come First Served
export function fcfsScheduling(processes: Process[]): CPUSchedulingResult {
  if (processes.length === 0) {
    return {
      schedule: [],
      waitingTimes: {},
      turnaroundTimes: {},
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
    }
  }

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const schedule: { process: string; startTime: number; endTime: number }[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}

  let currentTime = 0
  for (const process of sorted) {
    const startTime = Math.max(currentTime, process.arrivalTime)
    const endTime = startTime + process.burstTime
    schedule.push({ process: process.id, startTime, endTime })
    waitingTimes[process.id] = startTime - process.arrivalTime
    turnaroundTimes[process.id] = endTime - process.arrivalTime
    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / processes.length
  const avgTurnaroundTime =
    Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / processes.length
  const totalBurstTime = processes.reduce((a, b) => a + b.burstTime, 0)
  const cpuUtilization = schedule.length > 0 ? (totalBurstTime / schedule[schedule.length - 1].endTime) * 100 : 0

  return {
    schedule,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  }
}

// SJF: Shortest Job First (Non-preemptive)
export function sjfScheduling(processes: Process[]): CPUSchedulingResult {
  if (processes.length === 0) {
    return {
      schedule: [],
      waitingTimes: {},
      turnaroundTimes: {},
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
    }
  }

  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const schedule: { process: string; startTime: number; endTime: number }[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}

  let currentTime = 0
  const completed = new Set<string>()

  while (completed.size < processes.length) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime && !completed.has(p.id))

    if (available.length === 0) {
      const nextProcess = remaining.find((p) => !completed.has(p.id))
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime
      }
      continue
    }

    const process = available.reduce((min, p) => (p.burstTime < min.burstTime ? p : min))
    const startTime = currentTime
    const endTime = startTime + process.burstTime
    schedule.push({ process: process.id, startTime, endTime })
    waitingTimes[process.id] = startTime - process.arrivalTime
    turnaroundTimes[process.id] = endTime - process.arrivalTime
    currentTime = endTime
    completed.add(process.id)
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / processes.length
  const avgTurnaroundTime =
    Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / processes.length
  const totalBurstTime = processes.reduce((a, b) => a + b.burstTime, 0)
  const cpuUtilization = schedule.length > 0 ? (totalBurstTime / schedule[schedule.length - 1].endTime) * 100 : 0

  return {
    schedule,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  }
}

// Priority Scheduling (Non-preemptive)
export function priorityScheduling(processes: Process[]): CPUSchedulingResult {
  if (processes.length === 0) {
    return {
      schedule: [],
      waitingTimes: {},
      turnaroundTimes: {},
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
    }
  }

  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const schedule: { process: string; startTime: number; endTime: number }[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}

  let currentTime = 0
  const completed = new Set<string>()

  while (completed.size < processes.length) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime && !completed.has(p.id))

    if (available.length === 0) {
      const nextProcess = remaining.find((p) => !completed.has(p.id))
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime
      }
      continue
    }

    const process = available.reduce((min, p) =>
      (p.priority ?? 999) < (min.priority ?? 999) ? p : min
    )
    const startTime = currentTime
    const endTime = startTime + process.burstTime
    schedule.push({ process: process.id, startTime, endTime })
    waitingTimes[process.id] = startTime - process.arrivalTime
    turnaroundTimes[process.id] = endTime - process.arrivalTime
    currentTime = endTime
    completed.add(process.id)
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / processes.length
  const avgTurnaroundTime =
    Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / processes.length
  const totalBurstTime = processes.reduce((a, b) => a + b.burstTime, 0)
  const cpuUtilization = schedule.length > 0 ? (totalBurstTime / schedule[schedule.length - 1].endTime) * 100 : 0

  return {
    schedule,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  }
}

// Round Robin
export function roundRobinScheduling(processes: Process[], timeQuantum: number): CPUSchedulingResult {
  if (processes.length === 0) {
    return {
      schedule: [],
      waitingTimes: {},
      turnaroundTimes: {},
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
    }
  }

  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const schedule: { process: string; startTime: number; endTime: number }[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const remaining: Record<string, number> = {}
  const firstRun: Record<string, number> = {}

  processes.forEach((p) => {
    remaining[p.id] = p.burstTime
  })

  let currentTime = 0
  const readyQueue: Process[] = []
  let processIndex = 0

  while (Object.values(remaining).some((t) => t > 0)) {
    while (processIndex < queue.length && queue[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(queue[processIndex])
      processIndex++
    }

    if (readyQueue.length === 0) {
      currentTime = queue[processIndex]?.arrivalTime || currentTime
      continue
    }

    const process = readyQueue.shift()!
    if (!firstRun[process.id]) {
      firstRun[process.id] = currentTime
    }

    const timeSlice = Math.min(timeQuantum, remaining[process.id])
    const startTime = currentTime
    const endTime = startTime + timeSlice
    schedule.push({ process: process.id, startTime, endTime })

    remaining[process.id] -= timeSlice
    currentTime = endTime

    if (remaining[process.id] > 0) {
      readyQueue.push(process)
    } else {
      turnaroundTimes[process.id] = currentTime - process.arrivalTime
      waitingTimes[process.id] = turnaroundTimes[process.id] - process.burstTime
    }

    while (processIndex < queue.length && queue[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(queue[processIndex])
      processIndex++
    }
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / processes.length
  const avgTurnaroundTime =
    Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / processes.length
  const totalBurstTime = processes.reduce((a, b) => a + b.burstTime, 0)
  const cpuUtilization = schedule.length > 0 ? (totalBurstTime / schedule[schedule.length - 1].endTime) * 100 : 0

  return {
    schedule,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  }
}

// SRTF: Shortest Remaining Time First (Preemptive)
export function srtfScheduling(processes: Process[]): CPUSchedulingResult {
  if (processes.length === 0) {
    return {
      schedule: [],
      waitingTimes: {},
      turnaroundTimes: {},
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
    }
  }

  const schedule: { process: string; startTime: number; endTime: number }[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const remaining: Record<string, number> = {}
  const startTimes: Record<string, number> = {}

  processes.forEach((p) => {
    remaining[p.id] = p.burstTime
  })

  let currentTime = 0
  let completed = 0

  while (completed < processes.length) {
    const available = processes.filter(
      (p) => p.arrivalTime <= currentTime && remaining[p.id] > 0
    )

    if (available.length === 0) {
      const nextProcess = processes.find((p) => p.arrivalTime > currentTime && remaining[p.id] > 0)
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime
      }
      continue
    }

    const process = available.reduce((min, p) =>
      remaining[p.id] < remaining[min.id] ? p : min
    )

    if (!startTimes[process.id]) {
      startTimes[process.id] = currentTime
    }

    const startTime = currentTime
    remaining[process.id]--
    currentTime++

    if (remaining[process.id] === 0) {
      turnaroundTimes[process.id] = currentTime - process.arrivalTime
      waitingTimes[process.id] = turnaroundTimes[process.id] - process.burstTime
      completed++
    }

    if (
      !schedule.length ||
      schedule[schedule.length - 1].process !== process.id ||
      schedule[schedule.length - 1].endTime !== startTime
    ) {
      if (schedule.length && schedule[schedule.length - 1].endTime === startTime) {
        schedule[schedule.length - 1].endTime = currentTime
      } else {
        schedule.push({ process: process.id, startTime, endTime: currentTime })
      }
    } else {
      schedule[schedule.length - 1].endTime = currentTime
    }
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / processes.length
  const avgTurnaroundTime =
    Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / processes.length
  const totalBurstTime = processes.reduce((a, b) => a + b.burstTime, 0)
  const cpuUtilization = schedule.length > 0 ? (totalBurstTime / schedule[schedule.length - 1].endTime) * 100 : 0

  return {
    schedule,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  }
}
