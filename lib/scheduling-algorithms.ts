export interface SchedulingResult {
  sequence: number[]
  totalSeekTime: number
  algorithm: string
}

// FCFS - First Come First Served
export function fcfs(requests: number[], headPosition: number): SchedulingResult {
  const sequence = [headPosition, ...requests]
  let totalSeekTime = 0
  for (let i = 1; i < sequence.length; i++) {
    totalSeekTime += Math.abs(sequence[i] - sequence[i - 1])
  }
  return { sequence, totalSeekTime, algorithm: "FCFS" }
}

// SSTF - Shortest Seek Time First
export function sstf(requests: number[], headPosition: number): SchedulingResult {
  const remaining = [...requests]
  const sequence = [headPosition]
  let currentPosition = headPosition
  let totalSeekTime = 0

  while (remaining.length > 0) {
    let closestIndex = 0
    let closestDistance = Math.abs(remaining[0] - currentPosition)

    for (let i = 1; i < remaining.length; i++) {
      const distance = Math.abs(remaining[i] - currentPosition)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    currentPosition = remaining[closestIndex]
    sequence.push(currentPosition)
    totalSeekTime += closestDistance
    remaining.splice(closestIndex, 1)
  }

  return { sequence, totalSeekTime, algorithm: "SSTF" }
}

// SCAN - Elevator Algorithm
export function scan(requests: number[], headPosition: number): SchedulingResult {
  let totalSeekTime = 0
  let current = headPosition
  const remaining = [...requests]
  const sequence = [current]
  const diskSize = 200
  
  const sorted = remaining.sort((a, b) => a - b)
  const left = sorted.filter(r => r < current).reverse()
  const right = sorted.filter(r => r >= current)
  
  // Go right to the end first
  const rightSeq = right.concat([diskSize - 1])
  for (const track of rightSeq) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }
  
  // Then go left
  for (const track of left) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }

  return { sequence, totalSeekTime, algorithm: "SCAN" }
}

// C-SCAN - Circular SCAN (goes to end, wraps to 0, continues)
export function cscan(requests: number[], headPosition: number): SchedulingResult {
  let totalSeekTime = 0
  let current = headPosition
  const remaining = [...requests]
  const sequence = [current]
  const diskSize = 200
  
  const sorted = remaining.sort((a, b) => a - b)
  const right = sorted.filter(r => r >= current)
  const left = sorted.filter(r => r < current)
  
  // Service right side
  for (const track of right) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }
  
  // Jump to disk end, then to 0 (wrap around)
  if (left.length > 0) {
    totalSeekTime += Math.abs(current - (diskSize - 1))
    totalSeekTime += diskSize - 1 // Jump from end to start
    sequence.push(diskSize - 1, 0)
    current = 0
    
    // Service left side
    for (const track of left) {
      totalSeekTime += Math.abs(current - track)
      sequence.push(track)
      current = track
    }
  }

  return { sequence, totalSeekTime, algorithm: "C-SCAN" }
}

// LOOK - Look Ahead Scan (doesn't go to disk edges)
export function look(requests: number[], headPosition: number): SchedulingResult {
  let totalSeekTime = 0
  let current = headPosition
  const remaining = [...requests]
  const sequence = [current]
  
  const sorted = remaining.sort((a, b) => a - b)
  const left = sorted.filter(r => r < current).reverse()
  const right = sorted.filter(r => r >= current)
  
  // Go right to furthest request (not to disk end)
  for (const track of right) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }
  
  // Then go left to furthest request (not to disk start)
  for (const track of left) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }

  return { sequence, totalSeekTime, algorithm: "LOOK" }
}

// C-LOOK - Circular LOOK (jumps between min/max requests, not disk edges)
export function clook(requests: number[], headPosition: number): SchedulingResult {
  let totalSeekTime = 0
  let current = headPosition
  const remaining = [...requests]
  const sequence = [current]
  
  const sorted = remaining.sort((a, b) => a - b)
  const right = sorted.filter(r => r >= current)
  const left = sorted.filter(r => r < current)
  
  // Service right side
  for (const track of right) {
    totalSeekTime += Math.abs(current - track)
    sequence.push(track)
    current = track
  }
  
  // Jump to minimum request (if left side exists)
  if (left.length > 0) {
    totalSeekTime += Math.abs(current - left[0])
    current = left[0]
    
    // Service left side
    for (const track of left) {
      totalSeekTime += Math.abs(current - track)
      sequence.push(track)
      current = track
    }
  }

  return { sequence, totalSeekTime, algorithm: "C-LOOK" }
}
