import { ToastEngine, Scene } from './engine';
import { LightSource, GameObject, Sprite } from './engine/material';
import { Vector2, Vector3 } from './engine/math';
import { BoxCollider } from './engine/physics';

import background1 from './img/background/sky_lightened.png'
import background2 from './img/background/clouds_bg.png'
import background3 from './img/background/glacial_mountains_lightened.png'
import background4 from './img/background/clouds_mg_3.png'
import background5 from './img/background/clouds_mg_2.png'

import standing_gasmask from './img/standing_gasmask.png'
import spritesheet from './img/spritesheet.png'

class GameScene extends Scene {
    private player
    private jumping = false

    private sun

    private daynight = .7
    private night = 1

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

        this.player = new GameObject(engine, new Sprite(engine, standing_gasmask, { width: 32, height: 32 }))
        this.player.boxcollider = new BoxCollider(this.player, new Vector2(12, 32), new Vector2(13, 0))

        this.addWorld = this.player

        for (let i = 0; i < 10; i++) {
            const object = new GameObject(engine, new Sprite(engine, spritesheet, { width: 32, height: 32 }))
            object.boxcollider = new BoxCollider(object, new Vector2(32, 29), new Vector2(0, 3))
            object.boxcollider.stuck = true
            object.frame.x = 1
            if (i == 0)
                object.frame.x = 0
            if (i == 9)
                object.frame.x = 2
            object.position = new Vector2(-5*32+i*32, 32)

            this.addWorld = object
        }

        const object = new GameObject(engine, new Sprite(engine, spritesheet, { width: 32, height: 32 }))
        object.boxcollider = new BoxCollider(object, new Vector2(32, 29), new Vector2(0, 3))
        object.boxcollider.stuck = true
        object.frame.x = 1
        object.position = new Vector2(32, 0)

        this.addWorld = object

        this.sun = new LightSource(engine, new Vector2(0, 0), new Vector3(0.0, 0.0, 0.0), 1000)

        this.addWorld = this.sun
    }

    public update(dt: number) {
        let playerMovement = 0
        if (this.engine.getKeyDown('d')) playerMovement += 50
        if (this.engine.getKeyDown('a')) playerMovement -= 50
        if (this.engine.getKeyDown(' ') && !this.jumping) { this.player.velocity.y -= 300; this.jumping = true }
        if (this.player.velocity.y == 0) this.jumping = false
        if (this.player.velocity.y > 0) this.jumping = true
        
        if (playerMovement != 0) this.player.velocity.x = playerMovement

        if (
            this.player.velocity.x < .5 && this.player.velocity.y < .5 &&
            this.player.velocity.x > -.5 && this.player.velocity.y > -.5
        ) this.player.frame.x = (this.player.frame.x+2*dt) % 4


        this.player.velocity.x *= .8
        this.player.velocity.y *= .98
        this.player.velocity.y += 10

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