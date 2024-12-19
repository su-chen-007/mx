<template>
  <div style="position: relative;width: 1100px;height: 900px">
    <div style="width:100%;height:100%;display: flex;align-items: center;justify-content: center;">
      <span :style="{color:textColor}">
        {{text}}
      </span>
    </div>
    <div style="position: absolute;width: 1100px;height: 900px;top: 0;left: 0">
      <canvas id="pinkboardt" style=" width: 1100px;height: 900px " ref="pinkboard" @click="changeText"></canvas>
      <!-- 新增输入框，初始设为隐藏 -->
      <input type="text" v-model="inputText" placeholder="输入定制文字回车确定" style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); z-index: 10; background-color: rgba(255, 255, 255, 0.8); border: none; padding: 5px; border-radius: 5px; " ref="inputBox" @keyup.enter="updateText" />
    </div>
  </div>
  <Drawer title="设置" placement="top"  :closable="false" v-model="drawerValue">
  </Drawer>

</template>

<script setup >
import {onMounted, ref, watch} from 'vue'
defineOptions({
  name:"MyComponentLove",
})
const text=ref('L ❤ Y')
const textColor=ref('#ea80b0')
const defaultTextColors=ref( ['#ea80b0','#2D8CF0', '#FF9900', '#19C919', '#9B1DEA', '#EA4CA3'])
const defaultHeartColors=ref( ['#ea80b0','#2D8CF0', '#FF9900', '#19C919', '#9B1DEA', '#EA4CA3'])
const drawerValue=ref(false)
const heartColor=ref('#ea80b0')
const pinkboard=ref(null)

// 新增响应式数据用于控制输入框显示隐藏
const showInputBox = ref(false);
// 新增响应式数据用于存储输入框输入的文字
const inputText = ref('');

let canvasEl

onMounted(() => {

  // canvasEl=document.getElementById('pinkboard')
  canvasEl=pinkboard.value

  puttingItAll(canvasEl)
})
watch(heartColor,()=>{
  puttingItAll(canvasEl,heartColor)
})

// 新增函数用于更新显示的文本内容
function updateText() {
  text.value = inputText.value;
  // 隐藏输入框
  showInputBox.value = false;
  // 可以根据需要清空输入框内容，以下代码可选
  // inputText.value = '';
  // 获取输入框元素并隐藏它（更保险的做法，防止样式等问题导致显示异常）
  const inputBox = document.querySelector('input[ref="inputBox"]');
  if (inputBox) {
    inputBox.style.display = 'none';
  }
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const textArr=['L ❤ G','小仙女天生丽质','小仙女是我的']
let randomOld=0
function changeText(){
  let random=getRndInteger(0,textArr.length-1)
  if(random==randomOld && random==textArr.length-1){
    random=random-1
  }else if(random==randomOld){
    random=random+1
  }
  randomOld=random
  text.value=textArr[random]
}
/*
* Settings
*/
var settings = {
  particles: {
    length: 500, // maximum amount of particles
    duration: 2, // particle duration in sec
    velocity: 100, // particle velocity in pixels/sec
    effect: -0.75, // play with this for a nice effect
    size: 30, // particle size in pixels
  },
};

/*
 * RequestAnimationFrame polyfill by Erik Möller
 */
(function () {
  var b = 0
  var c = ['ms', 'moz', 'webkit', 'o']
  for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
    window.requestAnimationFrame = window[c[a] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[c[a] + 'CancelAnimationFrame'] || window[c[a] + 'CancelRequestAnimationFrame']
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (h, e) {
      var d = new Date().getTime()
      var f = Math.max(0, 16 - (d - b))
      var g = window.setTimeout(function () {
        h(d + f)
      }, f)
      b = d + f
      return g
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (d) {
      clearTimeout(d)
    }
  }
}())

/*
 * Point class
 */
var Point = (function () {
  function Point(x, y) {
    this.x = (typeof x !== 'undefined') ? x : 0
    this.y = (typeof y !== 'undefined') ? y : 0
  }

  Point.prototype.clone = function () {
    return new Point(this.x, this.y)
  }
  Point.prototype.length = function (length) {
    if (typeof length == 'undefined')
      return Math.sqrt(this.x * this.x + this.y * this.y)
    this.normalize()
    this.x *= length
    this.y *= length
    return this
  }
  Point.prototype.normalize = function () {
    var length = this.length()
    this.x /= length
    this.y /= length
    return this
  }
  return Point
})()

/*
 * Particle class
 */
var Particle = (function () {
  function Particle() {
    this.position = new Point()
    this.velocity = new Point()
    this.acceleration = new Point()
    this.age = 0
  }

  Particle.prototype.initialize = function (x, y, dx, dy) {
    this.position.x = x
    this.position.y = y
    this.velocity.x = dx
    this.velocity.y = dy
    this.acceleration.x = dx * settings.particles.effect
    this.acceleration.y = dy * settings.particles.effect
    this.age = 0
  }
  Particle.prototype.update = function (deltaTime) {
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
    this.velocity.x += this.acceleration.x * deltaTime
    this.velocity.y += this.acceleration.y * deltaTime
    this.age += deltaTime
  }
  Particle.prototype.draw = function (context, image) {
    function ease(t) {
      return (--t) * t * t + 1
    }

    var size = image.width * ease(this.age / settings.particles.duration)
    context.globalAlpha = 1 - this.age / settings.particles.duration
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size)
  }
  return Particle
})()

/*
 * ParticlePool class
 */

var ParticlePool = (function () {
  var particles,
      firstActive = 0,
      firstFree = 0,
      duration = settings.particles.duration

  function ParticlePool(length) {
    // create and populate particle pool
    particles = new Array(length)
    for (var i = 0; i < particles.length; i++)
      particles[i] = new Particle()
  }

  ParticlePool.prototype.add = function (x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy)

    // handle circular queue
    firstFree++
    if (firstFree == particles.length) firstFree = 0
    if (firstActive == firstFree) firstActive++
    if (firstActive == particles.length) firstActive = 0
  }
  ParticlePool.prototype.update = function (deltaTime) {
    let i

    // update active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].update(deltaTime)
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime)
      for (i = 0; i < firstFree; i++)
        particles[i].update(deltaTime)
    }

    // remove inactive particles
    while (particles[firstActive].age >= duration && firstActive != firstFree) {
      firstActive++
      if (firstActive == particles.length) firstActive = 0
    }


  }
  ParticlePool.prototype.draw = function (context, image) {
    let i
    // draw active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image)
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image)
      for (i = 0; i < firstFree; i++)
        particles[i].draw(context, image)
    }
  }
  return ParticlePool
})();

/*
 * Putting it all together
 */
function puttingItAll(canvas,heartColor){
  var context = canvas.getContext('2d'),
      particles = new ParticlePool(settings.particles.length),
      particleRate = settings.particles.length / settings.particles.duration, // particles/sec
      time

  // get point on heart with -PI <= t <= PI
  function pointOnHeart(t) {
    return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    )
  }

  // creating the particle image using a dummy canvas
  var image = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d')
    canvas.width = settings.particles.size
    canvas.height = settings.particles.size

    // helper function to create the path
    function to(t) {
      var point = pointOnHeart(t)
      point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350
      point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350
      return point
    }

    // create the path
    context.beginPath()
    var t = -Math.PI
    var point = to(t)
    context.moveTo(point.x, point.y)
    while (t < Math.PI) {
      t += 0.01 // baby steps!
      point = to(t)
      context.lineTo(point.x, point.y)
    }
    context.closePath()
    // create the fill
    context.fillStyle =heartColor? heartColor.value:'#ea80b0'
    context.fill()
    // create the image
    var image = new Image()
    image.src = canvas.toDataURL()
    return image
  })()

  // render that thing!
  function render() {
    // next animation frame
    requestAnimationFrame(render)

    // update time
    var newTime = new Date().getTime() / 1000,
        deltaTime = newTime - (time || newTime)
    time = newTime

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // create new particles
    var amount = particleRate * deltaTime
    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random())
      var dir = pos.clone().length(settings.particles.velocity)
      particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y)
    }

    // update and draw particles
    particles.update(deltaTime)
    particles.draw(context, image)
  }

  // handle (re-)sizing of the canvas
  function onResize() {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }

  window.onresize = onResize

  // delay rendering bootstrap
  setTimeout(function () {
    onResize()
    render()
  }, 10)
}
</script>

<style scoped>
html, body {
  height: 100%;
  padding: 0;
  margin: 0;
  background: #000;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
