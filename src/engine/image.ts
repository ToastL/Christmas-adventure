const canvas = document.querySelector<HTMLCanvasElement>("#img")
if (!canvas)
  throw new Error("Could not get image canvas")

const ctx = canvas.getContext("2d")
if (!ctx)
  throw new Error("Could not get image ctx")

class EngineImage {
  private width
  private height
  private data

  public loaded = false

  constructor() {
    this.width = 0
    this.height = 0
    this.data = new Uint8ClampedArray([])
  }

  public async loadPNG(path: string) {
    if (!ctx)
      throw new Error("Could not get image ctx")
  
    await new Promise<{width: number, height: number, data: Uint8ClampedArray}>(async (resolve, reject) => {
      if (!path) {
        reject();
      }
  
      const img = new Image()
      img.onload = function() {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, img.width, img.height)
        ctx.drawImage(img, 0, 0)
        let imgData1 = ctx.getImageData(0, 0, img.width, img.height).data

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, img.width, img.height)
        ctx.drawImage(img, 0, 0)
        const imgData2 = ctx.getImageData(0, 0, img.width, img.height).data

        for (let i = 0; i < imgData1.length/4; i++) {
          if (imgData1[i*4+0] != imgData2[i*4+0]) imgData2[i*4+3] = 0
        }

        resolve({
          width: img.width,
          height: img.height,
          data: imgData2
        })
      }
      img.src = path
    }).then(res => {
      this.width = res.width
      this.height = res.height
      this.data = res.data

      this.loaded = true
    })
  }

  public getPixel(x: number, y: number): {r: number, g: number, b: number, a: number} {
    if (x > this.width || y > this.height)
      throw new Error("X or Y is greater then the image size")
    
    return {
      r: this.data[(this.width*y+x)*4+0],
      g: this.data[(this.width*y+x)*4+1],
      b: this.data[(this.width*y+x)*4+2],
      a: this.data[(this.width*y+x)*4+3]
    }
  }

  public getWidth(): number { return this.width }
  public getHeight(): number { return this.height }
}

export { EngineImage }
export default { EngineImage }