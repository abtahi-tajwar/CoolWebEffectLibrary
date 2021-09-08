const container = document.querySelector('.carnival-particle-art-effect')
const containerOffset = {
  left: container.offsetLeft,
  top: container.offsetTop
}
let container_height = container.getBoundingClientRect().height;
let container_width = container.getBoundingClientRect().width;
container.innerHTML += '<canvas id="carnival-particle-art-effect-canvas"></canvas>'
const canvas = document.getElementById('carnival-particle-art-effect-canvas')
const c = canvas.getContext('2d')


container.style.position = 'relative';
canvas.style.position = 'absolute';
canvas.style.left = '0px'
canvas.style.top = '0px'
canvas.style.zIndex = '-100'

canvas.width = container_width
canvas.height = container_height


// let dataUrl
// function getDataUrl(img) {
//   // Create canvas
//   // Set width and height
//   canvas.width = img.width;
//   canvas.height = img.height;
//   // Draw the image
//   c.drawImage(img, 0, 0);
//   return canvas.toDataURL('image/png');
// }
// // Select the image
// const img = document.getElementById('img');
// img.addEventListener('load', function (event) {
//   dataUrl = getDataUrl(event.currentTarget);
//   console.log(dataUrl);
// });

var img = new Image()
img.crossOrigin = 'data'
img.src = './ammu.jpg'
console.log(img)

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
  x: 0,
  y: 0,
  r: 100,
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX - containerOffset.left;
  mouse.y = event.clientY - containerOffset.top;
})

canvas.addEventListener('resize', () => {
  const container_height = container.getBoundingClientRect().height;
  const container_width = container.getBoundingClientRect().width;
  canvas.width = container_width
  canvas.height = container_height
})

//Loading image
const myImage = new Image()
//myImage.src = dataUrl
img.addEventListener('load', () => {
  //console.log(myImage)
  //myImage.src = 'image.png'
  // container_height = myImage.naturalHeight
  // container_height = myImage.naturalWidth
  // canvas.width = container_width
  // canvas.height = container_height
  // container.style.height = container_height
  // container.style.width = container_width
  let aspect_ratio = img.naturalWidth / img.naturalHeight
  c.drawImage(img, 0, 0, canvas.width, canvas.width / aspect_ratio)
  console.log(canvas.width, canvas.height / aspect_ratio)
  const pixels = c.getImageData(0, 0, canvas.width, canvas.height)
  console.log(pixels)  
   

  //const pixels = c.getImageData(0, 0, canvas.width, canvas.height)
  c.clearRect(0, 0, canvas.width, canvas.height)
  

  pixelMap = []

  for(let y = 0; y < canvas.height; y++) {
    let row = []
    for(let x = 0; x < canvas.width; x++) {
      const red = pixels.data[(y * 4 * canvas.width) + (x * 4)]
      const blue = pixels.data[(y * 4 * canvas.width) + (x * 4 + 1)]
      const green = pixels.data[(y * 4 * canvas.width) + (x * 4 + 2)]
      const brightness = (0.299*red + 0.587*green + 0.114*blue)/100
      row.push({
        r: red,
        g: blue,
        b: green,
        brightness: brightness
      })
    }
    pixelMap.push(row)
  }
  // Objects
  class Particle {
    constructor(x, y, radius, color) {
      this.x = x
      this.y = y
      this.initX = this.x
      this.initY =  this.y
      this.radius = radius
      this.color = color
      this.density = Math.random()*30 + 1
    }
    draw() {
      c.beginPath()      
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill()
      c.closePath()
    }

    update() {
      let dx = mouse.x - this.x
      let dy = mouse.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      let forceX = dx / distance
      let forceY = dy / distance
      let force = (mouse.r - distance) / mouse.r
      let directionX = forceX * this.density * force
      let directionY = forceY * this.density * force

      if(distance < mouse.r) {
        this.x -= directionX
        this.y -= directionY
      } else {
        if(this.x !== this.initX ) {
          let dx = this.x - this.initX
          this.x -= dx/5
        } if(this.y !== this.initY ) {
          let dy = this.y - this.initY
          this.y -= dy/5
        }
      }
      this.draw()
    }
  }

  // Implementation
  let particles = []
  function init() {
    for (let y = 0; y < canvas.height; y += 6) {
      for(let x = 0; x < canvas.width; x += 6) {
        if(pixelMap[y][x].brightness > 0) {
          particles.push(new Particle(x, y, 3, `rgb(${pixelMap[y][x].r}, ${pixelMap[y][x].g}, ${pixelMap[y][x].b} )`))
        }        
      }      
    }
  }


  // Animation Loop
  function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(particle => {      
      particle.update()
    })
    requestAnimationFrame(animate)
  }

  init()
  animate()
}, false)

