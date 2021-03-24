const container = document.querySelector('.carnival-circular-motion-effect')
const container_height = container.getBoundingClientRect().height;
const container_width = container.getBoundingClientRect().width;
container.innerHTML += '<canvas id="carnival-circular-motion-effect-canvas"></canvas>'
const canvas = document.getElementById('carnival-circular-motion-effect-canvas')
const c = canvas.getContext('2d')


container.style.position = 'relative';
canvas.style.position = 'absolute';
canvas.style.left = '0px'
canvas.style.top = '0px'
canvas.style.zIndex = '-100'

canvas.width = container_width
canvas.height = container_height
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}


const mouse = {
  x: innerWidth ,
  y: innerHeight
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  const container_height = container.getBoundingClientRect().height;
  const container_width = container.getBoundingClientRect().width;
  canvas.width = container_height
  canvas.height = container_width
})

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.motionRadius = randomIntFromRange(70, 100)
    this.angle = Math.random() * Math.PI*2;
    this.speed = Math.random() * 0.08 + 0.04;
    this.initialRadias = canvas.width/2;
    this.mouseLocation = {
      x: x,
      y: y
    }
  }

  draw(prevLocation) {
    c.beginPath()
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(prevLocation.x, prevLocation.y)
    c.lineTo(this.x, this.y)
    c.stroke()    
    // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    // c.fillStyle = this.color
    // c.fill()
    c.closePath()
  }

  update() {
    const prevLocation = {
      x: this.x,
      y: this.y
    }
    this.angle += this.speed;
    this.mouseLocation.x += (mouse.x - this.mouseLocation.x) * 0.05
    this.mouseLocation.y += (mouse.y - this.mouseLocation.y) * 0.05
    if(this.initialRadias > this.motionRadius) {
      this.initialRadias -= 5;
    }
    this.x = this.mouseLocation.x + Math.cos(this.angle) * this.initialRadias
    this.y = this.mouseLocation.y + Math.sin(this.angle) * this.initialRadias
    this.draw(prevLocation)
  }
}

// Implementation
let particles = []
function init() {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(canvas.width/2, canvas.height/2, Math.random() * 2 + 1, randomColor(colors)))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'rgba(255, 255, 255, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height)  

  particles.forEach(particle => {
    particle.update()
  })
  // objects.forEach(object => {
  //  object.update()
  // })
}

init()
animate()