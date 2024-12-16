import Engine from "./util/engine";

class Client extends Engine {
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx, 800, 500)
    }

    public update() {

    }

    public render() {
        for (let x = 0; x < 800/this.pixelSize; x++)
            for (let y = 0; y < 800/this.pixelSize; y++)
                this.setPixel(x, y, `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`)

        for (let x = 0; x < 10; x++) 
            for (let y = 0; y < 10; y++) {
                this.imageData.data[0] = 0
            }
    }
}

export default Client;