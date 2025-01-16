import { ToastEngine, Scene } from './engine';
import { LightSource, GameObject, Sprite } from './engine/material';
import { ValueNoise, Vector2, Vector3 } from './engine/math';
import { BoxCollider } from './engine/physics';

import background1 from './img/background/sky_lightened.png'
import background2 from './img/background/clouds_bg.png'
import background3 from './img/background/glacial_mountains_lightened.png'
import background4 from './img/background/clouds_mg_3.png'
import background5 from './img/background/clouds_mg_2.png'

import running_gasmask from './img/running_gasmask.png'
import standing_gasmask from './img/standing_gasmask.png'
import spritesheet from './img/spritesheet.png'

import torch_sprite from './img/torch.png'

import { ChunkList, createChunk, getRenderBlocks } from './chunk.ts'

class GameScene extends Scene {
    private player
    private player_sprites: { [key: string]: Sprite }
    private jumping = false

    private torch

    private sun

    private daynight = .7
    private night = 1
    
    private worldNoise: ValueNoise
    private terrainChunks: ChunkList

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
        
        this.worldNoise = new ValueNoise(Math.round(Math.random()*1000))

        this.terrainChunks = {
            chunkSize: 10,
            chunks: []
        }
        for (let i = 0; i < 1; i++) this.terrainChunks.chunks.push(createChunk(this.worldNoise, i, this.terrainChunks.chunkSize))

        this.player_sprites = {
            "idle": new Sprite(engine, standing_gasmask, { width: 32, height: 32 }),
            "running": new Sprite(engine, running_gasmask, { width: 32, height: 32})
        }
        this.player = new GameObject(engine, this.player_sprites.idle)
        this.player.boxcollider = new BoxCollider(this.player, false, new Vector2(12, 32), new Vector2(13, 0))

        this.addWorld = this.player

        this.sun = new LightSource(engine, new Vector2(0, 0), new Vector3(0.0, 0.0, 0.0), 1000)

        this.addWorld = this.sun

        this.torch = new GameObject(engine, new Sprite(engine, torch_sprite, { width: 8, height: 32}))

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
        if (Math.abs(this.player.velocity.x) > .5) {
            this.player.sprite = this.player_sprites.running
            this.player.frame.x = (this.player.frame.x+5*dt) % 4
            
        }
        else {
            this.player.sprite = this.player_sprites.idle 
            this.player.frame.x = (this.player.frame.x+2*dt) % 4
        }
       
        getRenderBlocks(this, this.worldNoise, this.camera, this.terrainChunks)

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