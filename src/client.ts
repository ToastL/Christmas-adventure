import Engine from "./engine";

import { EngineImage } from "./engine/image";
import { EngineObject } from "./engine/object";

class Client extends Engine {
  private playerImages: EngineImage[]
  private player: EngineObject
  
  private playerX: number = 0
  private playerY: number = 32

  private aDown = false
  private dDown = false

  private playerFrame = 0

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx, 800, 500)

    this.player = new EngineObject(32, 32, 0, 0)
    this.playerImages = []
  }

  public async init() {
    for (let i = 0; i < 4; i++) {
      const playerImage = new EngineImage()

      await playerImage.loadPNG(`/images/standing_gasmask/frame${i+1}.png`)

      this.playerImages.push(playerImage) 
    }

    this.player.setImage(this.playerImages[this.playerFrame])
  }

  public update(dt: number) {
    let moved = false
    if (this.aDown) {
      this.playerX -= 40*dt
      
      moved = true
    }
    if (this.dDown) {
      this.playerX += 40*dt
      
      if (moved) moved = false
      else moved = true
    }

    if (!moved) {
      this.playerFrame += 5 * dt
      if (this.playerFrame > 4) this.playerFrame = 0
      this.player.setImage(this.playerImages[Math.floor(this.playerFrame)])
    } else {
      this.playerFrame = 0
      this.player.setImage(this.playerImages[Math.floor(this.playerFrame)])
    }

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