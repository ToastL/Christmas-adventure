import { EngineImage } from "./image"

class EngineObject {
    private width
    private height
    
    private posX
    private posY

    private image
    
    constructor(w: number, h: number, x: number, y: number, sprite?: EngineImage) {
        this.width = w
        this.height = h

        this.posX = x
        this.posY = y

        if (sprite)
            this.image = sprite 
    }

    public setImage(image: EngineImage) { this.image = image }
    public getImage(): EngineImage | undefined { if (this.image) return this.image }

    
    public setPosX(value: number) { this.posX = value }
    public getPosX(): number { return this.posX }

    public setPosY(value: number) { this.posY = value }
    public getPosY(): number { return this.posY }

    public getPos(): number[] { return [this.posX, this.posY] }
}

export { EngineObject }
export default { EngineObject }