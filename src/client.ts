import { ToastEngine, Scene } from './engine';
import { LightSource, GameObject, Sprite } from './engine/material';
import { ValueNoise, Vector2, Vector3 } from './engine/math';
import { BoxCollider } from './engine/physics';

import background1 from './img/background/sky_lightened.png'
import background2 from './img/background/clouds_bg.png'
import background3 from './img/background/glacial_mountains_lightened.png'
import background4 from './img/background/clouds_mg_3.png'
import background5 from './img/background/clouds_mg_2.png'

import standing_gasmask from './img/standing_gasmask.png'
import spritesheet from './img/spritesheet.png'

import torch_sprite from './img/torch.png'

import { createChunk } from './chunk.ts'

class GameScene extends Scene {
    private player
    private jumping = false

    private torch

    private sun

    private daynight = .7
    private night = 1
    
    private terrainGen: ValueNoise
    private terrainChunks: number[][]

    constructor(engine: ToastEngine) {
        super(engine)

        this.world.background = [
            { 
                layer: new Sprite(engine, background1, { width: 384, height: 280}),
                speed: 0
            },
            { 
                layer: new Sprite(engine, background2, { width: 384, height: 216}),
                speed: .1
            },
            { 
                layer: new Sprite(engine, background3, { width: 384, height: 216}),
                speed: .2
            },
            { 
                layer: new Sprite(engine, background4, { width: 384, height: 216}),
                speed: 1
            },
            { 
                layer: new Sprite(engine, background5, { width: 384, height: 216}),
                speed: 1
            },
        ]
        
        this.terrainGen = new ValueNoise(Math.round(Math.random()*1000))

        console.log(createChunk(1, 10))
        this.terrainChunks = []
        for (let i = 0; i < 20; i++) {
            let chunk: number[] = []
            const terrain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, j) => Math.round(this.terrainGen.getHeight(i*10+j)))
            for (let j = 0; j < 256; j++) chunk.push(...[0, 0, 0, 0, 0, 0, 0 , 0, 0, 0].map((_, k) => {
                if (terrain[k] == j)
                    return 1
                return 0
            }))
            this.terrainChunks[i] = chunk
        }

        for (let c = 0; c < this.terrainChunks.length; c++) {
            for (let i = 0; i < 256; i++) {
                for (let j = 0; j < 10; j++) {
                    const blockID = this.terrainChunks[c][i*10+j]
    
                    if (blockID > 0) {
                        const block = new GameObject(engine, new Sprite(engine, spritesheet))
                        block.boxcollider = new BoxCollider(block, true, new Vector2(32, 28), new Vector2(0, 4))
                        block.frame.x = 1
                        block.position.x = (c*10+j)*32
                        block.position.y = i*32
    
                        this.addWorld = block
                    }
                }
            }
        }

        this.player = new GameObject(engine, new Sprite(engine, standing_gasmask, { width: 32, height: 32 }))
        this.player.boxcollider = new BoxCollider(this.player, false, new Vector2(12, 32), new Vector2(13, 0))

        this.addWorld = this.player

        for (let i = 0; i < 100; i++) {
            const height = Math.round(this.terrainGen.getHeight(i))

            // this.terrain.push(height)
        }

        // this.player.position.y = this.terrain[0]*32-96

        this.sun = new LightSource(engine, new Vector2(0, 0), new Vector3(0.0, 0.0, 0.0), 1000)

        this.addWorld = this.sun

        this.torch = new GameObject(engine, new Sprite(engine, torch_sprite, { width: 8, height: 32}))
        // this.torch.position.y = (this.terrain[0]-1)*32

        this.addWorld = this.torch
    }

    public update(dt: number) {
        let playerMovement = 0
        if (this.engine.getKeyDown('d')) playerMovement += 200
        if (this.engine.getKeyDown('a')) playerMovement -= 200
        if (this.engine.getKeyDown(' ') && !this.jumping) { this.player.velocity.y -= 320; this.jumping = true }
        if (this.player.velocity.y == 0) this.jumping = false
        if (this.player.velocity.y > 0) this.jumping = true
        
        if (playerMovement != 0) this.player.velocity.x = playerMovement

        if (
            this.player.velocity.x < .5 && this.player.velocity.y < .5 &&
            this.player.velocity.x > -.5 && this.player.velocity.y > -.5
        ) this.player.frame.x = (this.player.frame.x+2*dt) % 4
        this.torch.frame.x = (this.torch.frame.x+4*dt) % 4


        this.player.velocity.x *= .8
        this.player.velocity.y *= .98
        this.player.velocity.y += 1000 * dt

        this.camera.position.x += (this.player.position.x - this.camera.position.x) / 10
        this.camera.position.y += (this.player.position.y - this.camera.position.y + 32) / 10

        this.backgroundPosition = this.camera.position.x
        // this.camera.position = new Vector2(this.player.position.x, this.player.position.y)

        this.sun.position.x = this.camera.position.x
        this.sun.position.y = this.camera.position.y - 200
        
        this.daynight += .01 * (this.night*2-1) * dt
        if (this.daynight > 1 || this.daynight < 0) this.night = 1 - this.night

        this.sun.color.x = this.daynight
        this.sun.color.y = this.daynight
        this.sun.color.z = this.daynight
    }
}

export default GameScene