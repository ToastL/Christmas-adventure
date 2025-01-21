import { ToastEngine, Scene } from './engine';
import { LightSource, GameObject, Sprite } from './engine/material';
import { ValueNoise, Vector2, Vector3 } from './engine/math';
import { BoxCollider } from './engine/physics';

import background1 from './img/background/sky_lightened.png';
import background2 from './img/background/clouds_bg.png';
import background3 from './img/background/glacial_mountains_lightened.png';
import background4 from './img/background/clouds_mg_3.png';
import background5 from './img/background/clouds_mg_2.png';

import running_gasmask from './img/running_gasmask.png';
import standing_gasmask from './img/standing_gasmask.png';
import jumping_gasmask from './img/jumpging_Sheet.png';

import cloudperson from './img/cloudperson-Sheet.png';

import torch_sprite from './img/torch.png';

import { ChunkList, createChunk, getRenderBlocks } from './chunk.ts';

class GameScene extends Scene {
    private player;
    private player_sprites: { [key: string]: Sprite };
    private playerFlip = false;
    private jumping = false;

    private cloud_sprites: { [key: string]: Sprite };
    private cloud: GameObject;

    private torch;

    private sun;

    private daynight = 0.7;
    private night = 1;
    
    private worldNoise: ValueNoise;
    private terrainChunks: ChunkList;

    constructor(engine: ToastEngine) {
        super(engine);

        this.world.background = [
            { 
                layer: new Sprite(engine, background1, { width: 384, height: 280}),
                speed: 0
            },
            { 
                layer: new Sprite(engine, background2, { width: 384, height: 216}),
                speed: 0.1
            },
            { 
                layer: new Sprite(engine, background3, { width: 384, height: 216}),
                speed: 0.2
            },
            { 
                layer: new Sprite(engine, background4, { width: 384, height: 216}),
                speed: 1
            },
            { 
                layer: new Sprite(engine, background5, { width: 384, height: 216}),
                speed: 1
            },
        ];
        
        this.worldNoise = new ValueNoise(Math.round(Math.random() * 1000));

        this.terrainChunks = {
            chunkSize: 10,
            chunks: []
        };
        for (let i = 0; i < 1; i++) this.terrainChunks.chunks.push(createChunk(this.worldNoise, i, this.terrainChunks.chunkSize));

        this.cloud_sprites = {
            "idle": new Sprite(engine, cloudperson, { width: 64, height: 64 })
        };

        this.player_sprites = {
            "idle": new Sprite(engine, standing_gasmask, { width: 32, height: 32 }),
            "running": new Sprite(engine, running_gasmask, { width: 32, height: 32}),
            "jumping": new Sprite(engine, jumping_gasmask, { width: 32, height: 32})
        };
        this.player = new GameObject(engine, this.player_sprites.idle);
        this.player.boxcollider = new BoxCollider(this.player, false, new Vector2(12, 32), new Vector2(13, 0));

        this.cloud = new GameObject(engine, this.cloud_sprites.idle);
        this.cloud.boxcollider = new BoxCollider(this.cloud, false, new Vector2(12, 32), new Vector2(13, 0));

        this.addWorld = this.player;

        this.sun = new LightSource(engine, new Vector2(0, 0), new Vector3(0.0, 0.0, 0.0), 1000);

        this.addWorld = this.sun;

        this.torch = new GameObject(engine, new Sprite(engine, torch_sprite, { width: 8, height: 32}));

        this.addWorld = this.torch;
    }

    public update(dt: number) {
        let playerMovement = 0;
        
        if (this.engine.getKeyDown('d')) {
            this.playerFlip = false;
            playerMovement += 200;
        }
        if (this.engine.getKeyDown('a')) {
            this.playerFlip = true;
            playerMovement -= 200;
        }

        if (this.engine.getKeyDown(' ') && !this.jumping) { 
            this.player.velocity.y -= 320;
            this.jumping = true;
        }
    
        if (this.player.velocity.y == 0) this.jumping = false;
        if (this.player.velocity.y > 0) this.jumping = true;

        if (this.jumping) {
            this.player.sprite = this.player_sprites.jumping;
            this.player.frame.x = (this.playerFlip ? 3 : 0) + (this.player.frame.x + 5 * dt) % 3;
        } else if (playerMovement != 0) {
            this.player.sprite = this.player_sprites.running;
            this.player.frame.x = (this.playerFlip ? 4 : 0) + (this.player.frame.x + 5 * dt) % 4;
        } else {
            this.player.sprite = this.player_sprites.idle;
            this.player.frame.x = (this.playerFlip ? 4 : 0) + (this.player.frame.x + 2 * dt) % 4;
        }
    
        if (playerMovement != 0) this.player.velocity.x = playerMovement;

        getRenderBlocks(this, this.worldNoise, this.camera, this.terrainChunks);
    
        this.player.velocity.x *= 0.8;
        this.player.velocity.y *= 0.98;
        this.player.velocity.y += 1000 * dt;
    
        this.camera.position.x += (this.player.position.x - this.camera.position.x) / 10;
        this.camera.position.y += (this.player.position.y - this.camera.position.y + 32) / 10;
    
        this.backgroundPosition = this.camera.position.x;
        this.sun.position.x = this.camera.position.x;
        this.sun.position.y = this.camera.position.y - 200;
    
        this.daynight += 0.01 * (this.night * 2 - 1) * dt;
        if (this.daynight > 1 || this.daynight < 0) this.night = 1 - this.night;
    
        this.sun.color.x = this.daynight;
        this.sun.color.y = this.daynight;
        this.sun.color.z = this.daynight;
    }
}

export default GameScene;
