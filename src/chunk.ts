type Chunk = number[]

function createChunk(i: number, size: number) {
    const chunk: number[] = []
    let layer = Array(size).map((_, j) => Math.round(i*size+j))
    for (let j = 0; j < 256; j++) chunk.push(...Array(size).map((_, k) => {
        console.log(chunk)
        if (layer[k] = j)
            return 1
        return 0
    }))
    return chunk
}

export type { Chunk }
export { createChunk }