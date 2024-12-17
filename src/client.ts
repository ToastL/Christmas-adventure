import Engine from "./engine";

import { EngineImage } from "./engine/image";
import { EngineObject } from "./engine/object";

class Client extends Engine {
  private player: EngineObject
  
  private playerX: number = 0
  private playerY: number = 32

  private aDown = false
  private dDown = false

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx, 800, 500)

    this.player = new EngineObject(32, 32, 0, 0)
  }

  public async init() {
    const playerImage = new EngineImage()
    await playerImage.loadPNG("/images/standing_gasmask/frame1.png")

    this.player.setImage(playerImage)
  }

  public update(dt: number) {
    if (this.aDown)
        this.playerX -= 40*dt
    if (this.dDown)
        this.playerX += 40*dt
    this.player.setPosX(this.playerX)
    
    this.player.setPosY(this.playerY)
  }

  public render() {
    this.clear(55, 175, 225, 255)

    this.drawObject(this.player)
  }

  public keyDown(key: string) {
    if (key == "a") this.aDown = true
    if (key == "d") this.dDown = true
  }
  public keyUp(key: string) {
    if (key == "a") this.aDown = false
    if (key == "d") this.dDown = false
  }
}

export default Client;