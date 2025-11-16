export interface MemoryBlock {
  startAddress: number
  size: number
  processId?: string
  isFree: boolean
}

export interface MemoryAllocationResult {
  blocks: MemoryBlock[]
  allocated: boolean
  externalFragmentation: number
  internalFragmentation: number
  memoryUtilization: number
  allocatedBlocks: { processId: string; startAddress: number; size: number }[]
}

interface AllocationState {
  blocks: MemoryBlock[]
}

// First Fit
export function firstFitAllocation(
  totalMemory: number,
  requests: { processId: string; size: number }[]
): MemoryAllocationResult {
  const blocks: MemoryBlock[] = [{ startAddress: 0, size: totalMemory, isFree: true }]
  const allocatedBlocks: { processId: string; startAddress: number; size: number }[] = []

  for (const request of requests) {
    let allocated = false
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].isFree && blocks[i].size >= request.size) {
        blocks[i].processId = request.processId
        blocks[i].isFree = false

        if (blocks[i].size > request.size) {
          blocks.splice(i + 1, 0, {
            startAddress: blocks[i].startAddress + request.size,
            size: blocks[i].size - request.size,
            isFree: true,
          })
        }

        blocks[i].size = request.size
        allocatedBlocks.push({
          processId: request.processId,
          startAddress: blocks[i].startAddress,
          size: request.size,
        })
        allocated = true
        break
      }
    }
  }

  return calculateFragmentation(blocks, totalMemory, allocatedBlocks)
}

// Best Fit
export function bestFitAllocation(
  totalMemory: number,
  requests: { processId: string; size: number }[]
): MemoryAllocationResult {
  const blocks: MemoryBlock[] = [{ startAddress: 0, size: totalMemory, isFree: true }]
  const allocatedBlocks: { processId: string; startAddress: number; size: number }[] = []

  for (const request of requests) {
    let bestIndex = -1
    let bestSize = totalMemory + 1

    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].isFree && blocks[i].size >= request.size && blocks[i].size < bestSize) {
        bestIndex = i
        bestSize = blocks[i].size
      }
    }

    if (bestIndex !== -1) {
      blocks[bestIndex].processId = request.processId
      blocks[bestIndex].isFree = false

      if (blocks[bestIndex].size > request.size) {
        blocks.splice(bestIndex + 1, 0, {
          startAddress: blocks[bestIndex].startAddress + request.size,
          size: blocks[bestIndex].size - request.size,
          isFree: true,
        })
      }

      blocks[bestIndex].size = request.size
      allocatedBlocks.push({
        processId: request.processId,
        startAddress: blocks[bestIndex].startAddress,
        size: request.size,
      })
    }
  }

  return calculateFragmentation(blocks, totalMemory, allocatedBlocks)
}

// Worst Fit
export function worstFitAllocation(
  totalMemory: number,
  requests: { processId: string; size: number }[]
): MemoryAllocationResult {
  const blocks: MemoryBlock[] = [{ startAddress: 0, size: totalMemory, isFree: true }]
  const allocatedBlocks: { processId: string; startAddress: number; size: number }[] = []

  for (const request of requests) {
    let worstIndex = -1
    let worstSize = -1

    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].isFree && blocks[i].size >= request.size && blocks[i].size > worstSize) {
        worstIndex = i
        worstSize = blocks[i].size
      }
    }

    if (worstIndex !== -1) {
      blocks[worstIndex].processId = request.processId
      blocks[worstIndex].isFree = false

      if (blocks[worstIndex].size > request.size) {
        blocks.splice(worstIndex + 1, 0, {
          startAddress: blocks[worstIndex].startAddress + request.size,
          size: blocks[worstIndex].size - request.size,
          isFree: true,
        })
      }

      blocks[worstIndex].size = request.size
      allocatedBlocks.push({
        processId: request.processId,
        startAddress: blocks[worstIndex].startAddress,
        size: request.size,
      })
    }
  }

  return calculateFragmentation(blocks, totalMemory, allocatedBlocks)
}

// Buddy System
export function buddySystemAllocation(
  totalMemory: number,
  requests: { processId: string; size: number }[]
): MemoryAllocationResult {
  const blocks: MemoryBlock[] = [{ startAddress: 0, size: totalMemory, isFree: true }]
  const allocatedBlocks: { processId: string; startAddress: number; size: number }[] = []

  for (const request of requests) {
    let allocated = false

    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].isFree && blocks[i].size >= request.size) {
        let blockSize = blocks[i].size
        let nextPowerOf2 = 1

        while (nextPowerOf2 < request.size) {
          nextPowerOf2 *= 2
        }

        const remainderSize = blocks[i].size - nextPowerOf2

        blocks[i].processId = request.processId
        blocks[i].isFree = false
        blocks[i].size = nextPowerOf2

        if (remainderSize > 0) {
          blocks.splice(i + 1, 0, {
            startAddress: blocks[i].startAddress + nextPowerOf2,
            size: remainderSize,
            isFree: true,
          })
        }

        allocatedBlocks.push({
          processId: request.processId,
          startAddress: blocks[i].startAddress,
          size: nextPowerOf2,
        })

        allocated = true
        break
      }
    }
  }

  return calculateFragmentation(blocks, totalMemory, allocatedBlocks)
}

// Paging (Fixed-size pages)
export function pagingAllocation(
  totalMemory: number,
  pageSize: number,
  requests: { processId: string; size: number }[]
): MemoryAllocationResult {
  const blocks: MemoryBlock[] = []
  const allocatedBlocks: { processId: string; startAddress: number; size: number }[] = []
  let currentAddress = 0

  const totalPages = Math.ceil(totalMemory / pageSize)

  for (const request of requests) {
    const pagesNeeded = Math.ceil(request.size / pageSize)
    let pagesAllocated = 0

    for (let i = 0; i < pagesNeeded && currentAddress + pageSize <= totalMemory; i++) {
      blocks.push({
        startAddress: currentAddress,
        size: pageSize,
        processId: request.processId,
        isFree: false,
      })
      currentAddress += pageSize
      pagesAllocated++
    }

    if (pagesAllocated === pagesNeeded) {
      allocatedBlocks.push({
        processId: request.processId,
        startAddress: currentAddress - pagesAllocated * pageSize,
        size: pagesAllocated * pageSize,
      })
    }
  }

  return calculateFragmentation(blocks, totalMemory, allocatedBlocks)
}

function calculateFragmentation(
  blocks: MemoryBlock[],
  totalMemory: number,
  allocatedBlocks: { processId: string; startAddress: number; size: number }[]
): MemoryAllocationResult {
  let externalFragmentation = 0
  let freeSpaceCount = 0

  for (const block of blocks) {
    if (block.isFree) {
      externalFragmentation += block.size
      freeSpaceCount++
    }
  }

  let internalFragmentation = 0
  for (const block of blocks) {
    if (!block.isFree && block.processId) {
      const requestedSize = allocatedBlocks.find((ab) => ab.processId === block.processId)?.size
      if (requestedSize) {
        internalFragmentation += block.size - requestedSize
      }
    }
  }

  const allocatedMemory = allocatedBlocks.reduce((sum, ab) => sum + ab.size, 0)
  const memoryUtilization = (allocatedMemory / totalMemory) * 100

  return {
    blocks,
    allocated: allocatedBlocks.length > 0,
    externalFragmentation,
    internalFragmentation,
    memoryUtilization,
    allocatedBlocks,
  }
}
