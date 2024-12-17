import './styles.css'

import Client from './client'

import * as Time from './util/time'

const canvas = document.querySelector<HTMLCanvasElement>('#app')
if (!canvas)
  throw new Error("Could not get canvas")

const ctx = canvas.getContext("2d")
if (!ctx)
  throw new Error("Could not get ctx")

ctx.imageSmoothingEnabled = false

const client = new Client(ctx)

client.init()

canvas.addEventListener("mousemove", e => {if (client.mouseMove) client.mouseMove(e.offsetX, e.offsetY)})
document.addEventListener("keydown", e => {if (client.keyDown) client.keyDown(e.key)})
document.addEventListener("keyup", e => {if (client.keyUp) client.keyUp(e.key)})

let UPS = 1000 / 120

let previous = Time.getCurrentMillis()
let lag = 0

let timer = Time.getCurrentMillis();

let frames = 0, ticks = 0

const loop = () => {
  const current = Time.getCurrentMillis()
  const elapsed = current - previous
  previous = current
  lag += elapsed

  client.update(elapsed/1000)
  
  client.beforeRender()
  client.render()
  client.afterRender()
  frames++

  if (Time.getCurrentMillis() - timer >= 1000) {
    console.log(`frames: ${frames} \t ticks: ${ticks}`)

    frames = 0
    ticks = 0
    timer += 1000
  }
  
  requestAnimationFrame(loop)
}

loop()