import { Scene, ToastEngine } from "./engine"
import { Camera, GameObject, Sprite } from "./engine/material"
import { ValueNoise, Vector2, Vector3 } from "./engine/math"
import { BoxCollider } from "./engine/physics"

import spritesheet from './img/spritesheet.png'

type Chunk = number[]
type ChunkList = {
    chunkSize: number,
    chunks: Chunk[]
}

function createChunk(terrainGen: ValueNoise, i: number, size: number) {
    const chunk: Chunk = Array(0)
    let layer = Array(size).fill(0).map((_, j) => Math.round(terrainGen.getHeight(i*size+j)))
    for (let j = 0; j < 256; j++) chunk.push(...Array(size).fill(0).map((_, k) => {
        if (layer[k] == j)
            return 1
        if (layer[k] < j)
            return 1
        return 0
    }))
    return chunk
}

function getRenderBlocks(scene: Scene, terrainGen: ValueNoise, camera: Camera, chunkList: ChunkList) {
    const camXStart = camera.position.x - camera.size.x/2
    const camXEnd = camera.position.x + camera.size.x/2
    const camYStart = camera.position.y - camera.size.y/2
    const camYEnd = camera.position.y + camera.size.y/2
    
    const chunkStart = Math.floor(camXStart/320) - 1
    const chunkEnd = Math.ceil(camXEnd/320) + 1

    const layerStart = Math.floor(camYStart/32) - 4
    const layerEnd = Math.ceil(camYEnd/32) + 4

    for (let chunkI = chunkStart; chunkI < chunkEnd; chunkI++) {
        if (!chunkList.chunks[chunkI])
            chunkList.chunks[chunkI] = createChunk(terrainGen, chunkI, chunkList.chunkSize)

        const chunk = chunkList.chunks[chunkI]

        for (let layerI = layerStart; layerI < layerEnd; layerI++) {
            if (layerI < 0) continue
            const layer = chunk.slice(layerI*chunkList.chunkSize, layerI*chunkList.chunkSize + chunkList.chunkSize)
            for (let i = 0; i < layer.length; i++) {
                if (layer[i] > 0) {
                    chunkList.chunks[chunkI][layerI*chunkList.chunkSize+i] = 0
                    const block = new GameObject(scene.engine, new Sprite(scene.engine, spritesheet, { width: 32, height: 32 }))
                    block.boxcollider = new BoxCollider(block, true, new Vector2(32, 28), new Vector2(0, 4))
                    block.frame.x = 1
                    block.position.x = chunkI*320+i*32
                    block.position.y = layerI*32
                    scene.addWorld = block
                }
            }
        }
    }
}

export type { Chunk, ChunkList }
export { createChunk, getRenderBlocks }