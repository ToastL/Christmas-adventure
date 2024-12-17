class Engine {
    private ctx: CanvasRenderingContext2D;

    public pixelSize

    public imageData: ImageData

    private width
    private height

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx

        this.pixelSize = 3;

        this.width = width
        this.height = height
        this.imageData = this.ctx.createImageData(this.width, this.height)
    }

    public beforeRender() {
        
    }

    public afterRender() {
        this.ctx.putImageData(this.imageData, 0, 0)
    }

    public drawPixel(
        x: number, 
        y: number,

        r: number, 
        g: number, 
        b: number, 
        a: number
    ) {
        if (x*this.pixelSize >= this.imageData.width || x < 0 || y*this.pixelSize >= this.imageData.height || y < 0) 
            throw new Error("Cannot set pixelsize greater or smaller then screen size")

        const pixels = this.imageData.data

        for (let xPos = 0; xPos < this.pixelSize; xPos++) {
            for (let yPos = 0; yPos < this.pixelSize; yPos++) {
                const index = (this.imageData.width*(yPos+this.pixelSize*y)+this.pixelSize*x+xPos)*4
                pixels[index+0] = r
                pixels[index+1] = g
                pixels[index+2] = b
                pixels[index+3] = a
            }
        }
    }

    public drawLine(
        x0: number,
        y0: number,
        x1: number,
        y1: number,

        r: number,
        g: number,
        b: number,
        a: number
    ) {
        const slope = (y1 - y0) / (x1 - x0)

        let x = x0
        let lastY = y0
        while (x <= x1) {
            const y = Math.round(slope * (x - x0) + y0)
            this.drawPixel(x, y, r, g, b, a)

            while (y - lastY > 0) {
                this.drawPixel(x, lastY, r, g, b, a)
                lastY++
            }

            x += 1
        }
    }

    public clear(r: number, g: number, b: number, a: number) {
        for (let x = 0; x < this.width/this.pixelSize; x++)
            for (let y = 0; y < this.height/this.pixelSize; y++)
                this.drawPixel(x, y, r, g, b, a)
    }

    public getWidth(): number { return this.width }
    public getHeight(): number{ return this.height }
}

export default Engine