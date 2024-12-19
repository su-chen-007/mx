<template>
  <div class="button-container">
    <button @click="stop">停止</button>
    <button @click="start">游戏开始</button>
  </div>
  <div style="color: #0fa1e0; text-align: center;font-size: 25px">score:{{scroce}}</div>
  <div class="box" :style="{width :boxWidth +'px', height:boxHeight +'px'}">
    <div class="str">{{str}}</div>
    <div class="kuaiBox">
      <div class="kuai" v-for="(item,index) in arr" :key="index" :style="{opacity :item.active ? '0':'1'}"></div>
    </div>
    <div class="ball" :style="{left :x + 'px', top : y + 'px', width : ball +'px', height: ball+'px'}"></div>
    <div class="bottomMove"
         :style="{left :mx + 'px' , top : my + 'px',width :moveBottomW +'px',height : moveBottomH+'px'  }"></div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, reactive, toRefs} from 'vue'

const boxWidth = 500, // 场景宽度
    boxHeight = 400, // 场景高度
    ball = 10,//小球的宽高
    moveBottomH = 20,//移动方块高度
    moveBottomW = 100//移动方块宽度

const strArr = '恭喜你,挑战成功!!'

const state = reactive({
  x: boxWidth / 2 - ball / 2,  // 小球x轴位置信息 计算默认位置在中间
  y: boxHeight - ball - moveBottomH, // 小球Y轴的位置信息 计算默认位置在中间
  mx: boxWidth / 2 - moveBottomW / 2, //移动方块的位置信息 计算默认位置在中间
  my: boxHeight - moveBottomH, // 移动方块y轴的的位置信息  计算默认位置在中间
  arr: Array.from({length: 50}, (_, index) => ({
    index,
    active: false
  })),
  str: '', // 返回挑战成功字眼
  scroce: 0 // 分数
})

const {x, y, mx, my, arr, str, scroce} = toRefs(state)
let timer = null, // 小球定时器
    speed = 6,// 小球速度
    map = {x: 10, y: 10},
    timer2 = null, // 挑战成功字眼显示定时器
    index = 0//挑战成功字眼续个显示的索引值

const strFun = () => {
  // 检查 index 是否超出 strArr 的长度
  if (index >= strArr.length) {
    clearInterval(timer2); // 如果超出长度，清除定时器
    return; // 停止函数执行
  }

  // 将 strArr 中的当前字符添加到 state.str
  state.str += strArr[index];

  // 打印日志，用于调试（可选）
  console.log(`Displaying: ${strArr[index]}, Current str: ${state.str}`);

  // 增加 index 以便下次调用时显示下一个字符
  index++;
}

const moveBall = () => {
  const {offsetTop, offsetHeight, offsetLeft, offsetWidth} = document.querySelector('.bottomMove')
  if (state.x <= 0) {
    map.x = speed
  } else if (state.x > boxWidth - ball) {
    map.x = -speed
  }
  if (state.y <= 0) {
    map.y = speed
  }
  if (state.y >= offsetTop - offsetHeight &&
      state.y <= offsetTop + offsetHeight &&
      state.x >= offsetLeft &&
      state.x < offsetLeft + offsetWidth) {
    map.y = -speed
  }
  if (state.y > boxHeight) {
    clearInterval(timer)
    alert('下次加油，MX打砖块分数：'+ state.scroce)
    window.location.reload()
  }
  Array.from(state.arr).forEach((item, index) => {
    const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = document.querySelectorAll('.kuai')[index]
    if (state.x > offsetLeft
        && state.x < offsetLeft + offsetWidth
        && state.y > offsetTop
        && state.y < offsetTop + offsetHeight) {
      if (!state.arr[index].active) {
        state.scroce += 100
      }
      state.arr[index].active = true
    }
  })
  if (Array.from(state.arr).every(item => item.active)) {
    clearInterval(timer)
    timer2 = setInterval(strFun, 1000)
  }
  state.x += map.x
  state.y += map.y
}

const bottomMove = ev => {
  switch (ev.key) {
    case 'ArrowRight':
      state.mx += 100
      break
    case  'ArrowLeft':
      state.mx -= 100
      break
  }
  state.mx = Math.max(0, Math.min(state.mx, boxWidth - moveBottomW))
}

const stop = () => {
  clearInterval(timer)
}

const start = () => {
  timer = setInterval(moveBall, 20)
}

onMounted(() => {
  document.addEventListener('keyup', bottomMove)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  cursor: pointer;
  background-color: #0fa1e0;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0d84b5;
}

.box {
  display: flex;
  justify-content: center;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  position: relative;
  border: 5px solid #48ff00;
  overflow: hidden;
}

.str {
  text-align: center;
  font-size: 50px;
  color: #5eff00;
}

.kuaiBox {
  display: flex;
  flex-wrap: wrap;
}

.kuai {
  width: 30px;
  height: 10px;
  background: #8cff00;
  margin: 10px;
  transition-duration: 100ms;
  transition-timing-function: ease-in;
}

.ball {
  width: 20px;
  height: 20px;
  background-color: #37ff00;
  border-radius: 50%;
  position: absolute;
}

.bottomMove {
  width: 100px;
  height: 20px;
  background: #37ff00;
  position: absolute;
  transition-duration: 100ms;
  transition-timing-function: ease-out;
}
</style>