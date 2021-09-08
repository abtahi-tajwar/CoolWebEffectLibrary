const container = document.querySelector('.carnival-moving-particle-effect')
const containerOffset = {
  left: container.offsetLeft,
  top: container.offsetTop
}
const container_height = container.getBoundingClientRect().height;
const container_width = container.getBoundingClientRect().width;
container.innerHTML += '<canvas id="carnival-moving-particle-effect-canvas"></canvas>'
const canvas = document.getElementById('carnival-moving-particle-effect-canvas')
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
  let mouseOnCanvas = false;
  if(
      event.clientX >= containerOffset.left && event.clientX <= containerOffset.left + container_width
      && event.clientY >= containerOffset.top && event.clientY <= containerOffset.top + container_height
    ) {
      mouseOnCanvas = true;
    }
  if(mouseOnCanvas) {
    mouse.x = event.clientX - containerOffset.left;
    mouse.y = event.clientY - containerOffset.top;
  } else {
    mouse.x = container_width / 2;
    mouse.y = container_height / 2;
  }

})

canvas.addEventListener('resize', () => {
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
    this.initSpeedX = Math.random() * 2 - 1
    this.initSpeedY = Math.random() * 2 - 1
    this.speedX = this.initSpeedX
    this.speedY = this.initSpeedY
    this.area = 100;
  }

  draw() {
    c.beginPath()      
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {   
    if(this.x + this.radius > canvas.width || (this.x + this.radius) < 0) {
      this.speedX = -this.speedX
    }
    else if(this.y + this.radius > canvas.height || (this.y + this.radius) < 0) {
      this.speedY = -this.speedY

    }
    this.x += this.speedX
    this.y += this.speedY
    
    //Detecting mouse collision and pushing away
    const distanceFromMouse = Math.pow((Math.pow((this.x - mouse.x),2) + Math.pow((this.y - mouse.y), 2)), 0.5)
    if(distanceFromMouse < 100 + this.radius) {
      if(mouse.x < this.x && this.x < canvas.width - this.radius*10) {
        this.x += 10
      }
      if(mouse.x < this.x && this.x < this.radius*10) {
        this.x -= 10
      }
      if(mouse.y < this.y && this.y < canvas.width - this.radius*10) {
        this.y += 10
      }
      if(mouse.y < this.y && this.y < this.radius*10) {
        this.y -= 10
      }
    }
    
    this.draw()
  }
  bounce() {
    this.x += -this.speedX * 1.1
    this.speedY = -this.speedY * 1.1
  }
  position() {
    return {
      x: this.x,
      y: this.y,
      area: this.area,
      radius: this.radius
    }
  }

}

// Implementation
let particles = []
function init() {
  for (let i = 0; i < 450; i++) {
    particles.push(new Particle(randomIntFromRange(1, canvas.width-1), randomIntFromRange(1, canvas.height-1), Math.random() * 2 + 1, randomColor(colors)))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(particle => {
    particle.update()    
  })
  particles.forEach(particle => {
    // const distFromMouse = Math.pow(Math.pow((particle.position().x - mouse.x),2) + Math.pow((particle.position().y - mouse.y),2), 0.5)
    
    particles.forEach(particle2 => {
      const dist = Math.pow(Math.pow((particle.position().x - particle2.position().x),2) + Math.pow((particle.position().y - particle2.position().y),2), 0.5)
      if(dist < 60) {
        c.beginPath()
        c.strokeStyle = 'rgba(0, 0, 0,'+ dist / 60 +')';
        c.lineWidth = dist * 0.002;
        c.moveTo(particle.position().x, particle.position().y)
        c.lineTo(particle2.position().x, particle2.position().y)
        c.stroke()
        c.closePath()
      }
    })    
  })
  

  // objects.forEach(object => {
  //  object.update()
  // })
}

init()
animate()