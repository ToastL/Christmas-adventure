import { BackBuffer, LightSource, Sprite, GameObject, Camera } from './material'
import { Matrix3x3, Vector2, Vector3 } from './math'

enum Blendmode {
    ALPHA,
    ADDITIVE,
    MULTIPLY
}

import white from '../img/white.png'

class ToastEngine {
    private _canvas: HTMLCanvasElement
    private _gl: WebGL2RenderingContext

    private running

    private initialTime

    private _worldMatrix

    private backBuffer
    private finalBuffer

    private white

    private keysDown: { [key: string]: boolean } = {}
    private _scene: Scene | null
    
    constructor() {
        this._canvas = document.createElement('canvas')
        const gl = this._canvas.getContext('webgl2')
        if (!gl) throw new Error('Browser does not support webgl2')

        this._gl = gl

        this.running = true

        this.initialTime = 0

        this._worldMatrix = new Matrix3x3()

        this.backBuffer = new BackBuffer(this, { width: 512, height: 269 })
        this.finalBuffer = new BackBuffer(this, { width: 512, height: 269 })

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0)

        this.white = new Sprite(this, white, { width: this.canvas.width, height: this.canvas.height})
        this.white.opacity = .8

        this._scene = null
    }

    public get worldMatrix() { return this._worldMatrix }
    public set worldMatrix(matrix) { this._worldMatrix = matrix}
    public get canvas() { return this._canvas }
    public get gl() { return this._gl }

    public get scene() { return this._scene }
    public set scene(value) { this._scene = value }

    public set buffer(buffer: any) {
        if (buffer instanceof BackBuffer) {
            this.gl.viewport(0, 0, buffer.size.x, buffer.size.y)
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, buffer.frameBuffer)
        } else {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    public set blendmode(bm: Blendmode) {
        switch (bm) {
            case Blendmode.ALPHA: this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); break
            case Blendmode.ADDITIVE: this.gl.blendFunc(this.gl.ONE, this.gl.ONE); break
            case Blendmode.MULTIPLY: this.gl.blendFunc(this.gl.DST_COLOR, this.gl.ZERO); break
        }
    }

    public bindCanvas(canvas: HTMLCanvasElement) {
        this._canvas.remove()
        this._canvas = canvas

        const gl = this._canvas.getContext('webgl2')
        if (!gl) throw new Error('Browser does not support webgl2')

        this._gl = gl
    }

    public appendCanvas(parent: Element) {
        parent.appendChild(this._canvas)
    }

    public init() {
        if (!this.gl) throw new Error('Your browser does not support webgl2')
    }

    public update(dt: number) {
        if (!this.scene) 
            return
        
        this.scene.update(dt)

        for (let i = 0; i < this.scene.world.objects.length; i++) {
            const object = this.scene.world.objects[i]

            object.update(dt)

            for (let j = 0; j < this.scene.world.objects.length; j++) {
                const currentObject = this.scene.world.objects[j]
                if (object == currentObject) continue

                if (object.boxcollider && currentObject.boxcollider && !object.boxcollider.stuck)
                    object.boxcollider.collides(currentObject.boxcollider)       
            }
        }
    }

    private render() {
        this.buffer = null
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.gl.enable(this.gl.BLEND)
        this.blendmode = Blendmode.ALPHA

        if (this.scene) {
            this.buffer = this.backBuffer
            for (let i = 0; i < this.scene.world.background.length; i++) {
                const backgroundPosition = this.scene.backgroundPosition
                const background = this.scene.world.background[i]

                background.layer.render(new Vector2(
                    this.scene.camera.position.x-(backgroundPosition*background.speed % background.layer.size.x)-background.layer.size.x*2-this.scene.camera.size.x/2,
                    this.scene.camera.position.y-this.scene.camera.size.y/2
                ), new Vector2(0, 0))
                background.layer.render(new Vector2(
                    this.scene.camera.position.x-(backgroundPosition*background.speed % background.layer.size.x)-background.layer.size.x-this.scene.camera.size.x/2,
                    this.scene.camera.position.y-this.scene.camera.size.y/2
                ),new Vector2(0, 0))
                background.layer.render(new Vector2(
                    this.scene.camera.position.x-(backgroundPosition*background.speed % background.layer.size.x)-this.scene.camera.size.x/2,
                    this.scene.camera.position.y-this.scene.camera.size.y/2
                ), new Vector2(0, 0))
                background.layer.render(new Vector2(
                    this.scene.camera.position.x-(backgroundPosition*background.speed % background.layer.size.x)+background.layer.size.x-this.scene.camera.size.x/2,
                    this.scene.camera.position.y-this.scene.camera.size.y/2
                ), new Vector2(0, 0))
                background.layer.render(new Vector2(
                    this.scene.camera.position.x-(backgroundPosition*background.speed % background.layer.size.x)+background.layer.size.x*2-this.scene.camera.size.x/2,
                    this.scene.camera.position.y-this.scene.camera.size.y/2
                ), new Vector2(0, 0))
            }

            for (let i = 0; i < this.scene.world.objects.length; i++) {
                const object = this.scene.world.objects[i]
                object.render()
            }
        
            this.buffer = this.finalBuffer
            this.white.render(new Vector2(
                this.scene.camera.position.x-this.scene.camera.size.x/2,
                this.scene.camera.position.y-this.scene.camera.size.y/2
            ), new Vector2(0, 0))

            this.blendmode = Blendmode.ADDITIVE
            for (let i = 0; i < this.scene.world.lights.length; i++)
                this.scene.world.lights[i].render()
        }

        this.buffer = null
        
        this.blendmode = Blendmode.ALPHA
        this.backBuffer.render()
        this.blendmode = Blendmode.MULTIPLY
        this.finalBuffer.render()

        this.gl.flush()
    }

    private loop(time: number) {
        const currTime = time * 0.001
        const dt = Math.min(0.1, currTime - this.initialTime)
        this.initialTime = currTime

        this.update(dt)
        this.render()

        if (this.running) requestAnimationFrame(time => this.loop(time))
    }

    public keyDown(key: string) {
        this.keysDown[key] = true
    }
    public keyUp(key: string) {
        this.keysDown[key] = false
    }

    public getKeyDown(key: string) {
        return this.keysDown[key]
    }

    public run() {
        this.init()
        requestAnimationFrame(time => this.loop(time))
    }

    public resize(x: number, y: number) {
        this.canvas.width = x
        this.canvas.height = y

        this.white.size = new Vector2(x, y)
        
        const height = 512 / (x / y)

        const wRatio = x / (y / height)
        this.worldMatrix = new Matrix3x3().translate(-1, 1).resize(2/wRatio, -2/height)
    }
}

type GameWorld = { "background_position": number, "background": { layer: Sprite, speed: number }[], "objects": GameObject[], "lights": LightSource[] }

class Scene {

    private _world: GameWorld

    private _camera: Camera

    private _engine

    constructor(engine: ToastEngine) {
        this._engine = engine

        this._world = {
            "background_position": 0,
            "background": [],
            "objects": [],
            "lights": []
        }

        this._camera = new Camera(engine, new Vector2(0, 0))
    }

    public get engine() { return this._engine }
    public set engine(value) { this._engine = value }

    public get backgroundPosition() { return this._world.background_position }
    public set backgroundPosition(value) { this._world.background_position = value }
    public get world() { return this._world }
    public set addWorld(value: GameObject | LightSource) { 
        if (value instanceof GameObject)
            this._world.objects.push(value)
        
        if (value instanceof LightSource)
            this._world.lights.push(value)
    }

    public get camera() { return this._camera }
    public set camera(value) { this._camera = value }

    public update(dt: number) {}
}

export { ToastEngine, Scene }
import { EngineImage } from "./image";
import { EngineObject } from "./object";

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
    x = Math.round(x)
    y = Math.round(y)
    
    if (x*this.pixelSize >= this.imageData.width || x < 0 || y*this.pixelSize >= this.imageData.height || y < 0) 
      return

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

  public drawSquare(
    x: number,
    y: number,
    w: number,
    h: number,
    
    r: number,
    g: number,
    b: number,
    a: number
  ) {
    for (let dX = x; dX < x+w; dX++)
      for (let dY = y; dY < y+h; dY++) {
        if (a == 0) console.log("test")
        this.drawPixel(dX, dY, r, g, b, a)
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

  public drawImage(
    x: number,
    y: number,
    
    image: EngineImage
  ) {
    if (!image.loaded) return

    for (let dX = 0; dX < image.getWidth(); dX++) {
      for (let dY = 0; dY < image.getHeight(); dY++) {
        const pixel = image.getPixel(dX, dY)

        if (pixel.a == 255)
          this.drawPixel(x+dX, y+dY, pixel.r, pixel.g, pixel.b, pixel.a)
      }
    }
  }

  public drawObject(
    object: EngineObject
  ) {
    const playerImage = object.getImage()
    if (playerImage) this.drawImage(object.getPosX(), object.getPosY(), playerImage)
  }

  public clear(r: number, g: number, b: number, a: number) {
    for (let x = 0; x < this.width/this.pixelSize; x++)
      for (let y = 0; y < this.height/this.pixelSize; y++)
        this.drawPixel(x, y, r, g, b, a)
  }

  public getWidth(): number { return this.width }
  public getHeight(): number{ return this.height }


  public mouseMove(x: number, y: number) {}
  public keyDown(key: string) {}
  public keyUp(key: string) {}
}

export default Engine