// class Rigidbody {
//     private mass
// }

import { GameObject } from "./material"
import { Vector2 } from "./math"

class BoxCollider {
    private _parent

    private _position
    private _size
    
    private _stuck

    constructor(parent: GameObject, size?: Vector2, position?: Vector2) {
        this._parent = parent

        this._position = new Vector2(0, 0)
        if (position) this._position = position
        this._size = parent.sprite.size
        if (size) this._size = size

        this._stuck = false
    }

    public get parent() { return this._parent}

    public get position() { return this._position }
    public get size() { return this._size }

    public get stuck() { return this._stuck }
    public set stuck(value) { this._stuck = value }

    public collides(boxcollider: BoxCollider) {
        const aMidX = this.parent.position.x + this.position.x + this.size.x/2
        const aMidY = this.parent.position.y + this.position.y + this.size.y/2
        const bMidX = boxcollider.parent.position.x + boxcollider.position.x + boxcollider.size.x/2
        const bMidY = boxcollider.parent.position.y + boxcollider.position.y + boxcollider.size.y/2

        const dx = (bMidX - aMidX) / (this.size.x + boxcollider.size.x)/2
        const dy = (bMidY - aMidY) / (this.size.y + boxcollider.size.y)/2

        const absDX = Math.abs(dx)
        const absDY = Math.abs(dy)

        if (absDX > absDY && absDX < 0.25) {
            if (dx < 0.25 && dx > 0) this.parent.position.x = boxcollider.parent.position.x - this.size.x - boxcollider.position.x - this.position.x
            if (dx > -0.25 && dx < 0) this.parent.position.x = boxcollider.parent.position.x + boxcollider.size.x - this.position.x - boxcollider.position.x

            this.parent.velocity.x = 0
        } else if (absDY > absDX && absDY < 0.25) {
            if (dy < 0.25 && dy > 0) { 
                this.parent.position.y = boxcollider.parent.position.y - this.size.y + boxcollider.position.y 
                this.parent.velocity.y = 0
            }
            if (dy > -0.25 && dy < 0) { 
                this.parent.position.y = boxcollider.parent.position.y + boxcollider.size.y - this.position.y
                this.parent.velocity.y = -1
            }

        }
    }
}

export { BoxCollider }