import './styles.css'

import Engine from './client'

import * as Time from './util/time'

const canvas = document.querySelector<HTMLCanvasElement>('#app')
if (!canvas)
  throw new Error("Could not get canvas")


const ctx = canvas.getContext("2d")
if (!ctx)
  throw new Error("Could not get ctx")

const engine = new Engine()

const UPS = 120
const FPS = 60

let initialTime = Time.getNanoTime()
const timeU = 1000000000 / UPS
const timeF = 1000000000 / FPS
let deltaU = 0, deltaF = 0
let frames, ticks = 0
let timer = Time.getCurrentMillis()

const loop = () => {
  const currentTime = Time.getNanoTime()
  deltaU += (currentTime - initialTime) / timeU
  deltaF += (currentTime - initialTime) / timeF
  initialTime = currentTime

  
  
  requestAnimationFrame(loop)
}

loop()