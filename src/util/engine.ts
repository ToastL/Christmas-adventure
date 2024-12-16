class Engine {
    private ctx: CanvasRenderingContext2D;

    public pixelSize

    public imageData: ImageData

    private width
    private height

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx

        this.pixelSize = 20;

        this.width = width
        this.height = height
        this.imageData = this.ctx.createImageData(this.width, this.height)
    }

    public setPixel(x: number, y: number, color: string) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(x*this.pixelSize, y*this.pixelSize, this.pixelSize, this.pixelSize)
    }

    public beforeRender() {
        
    }

    public afterRender() {
        this.ctx.putImageData(this.imageData, this.width, this.height)
    }
}

export default Engine