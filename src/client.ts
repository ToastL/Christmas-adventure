import Engine from "./util/engine";

class Client extends Engine {
    private lineX
    private lineY
    private lineI
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx, 800, 500)

        this.lineX = 5
        this.lineY = 5
        this.lineI = 0
    }

    public update(dt: number) {
        this.lineX = 60 + Math.cos(this.lineI)*10
        this.lineY = 60 + Math.sin(this.lineI)*10
        this.lineI+=1*dt
        // console.log(this.lineX)
    }

    public render() {
        this.clear(0, 0, 0, 255)

        this.drawLine(0, 0, this.lineX, this.lineY, 255, 255, 255, 255)
    }
}

export default Client;