<template>
  <div class="calculator" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
    <div class="title">
      <input type="text" v-model="customTitle" placeholder="烽火战队专用" @input="saveTitle" />
      <label for="background-upload" class="background-button">
        换背景</label>
      <input type="file" id="background-upload" style="display: none;" @change="setBackground" />
    </div>
    <div class="display">{{ displayValue }}</div>
    <div class="buttons">
      <div class="button-row">
        <button v-for="button in firstRow" :key="button" @click="input(button)">
          {{ button }}
        </button>
      </div>
      <div class="button-row">
        <button v-for="button in secondRow" :key="button" @click="input(button)">
          {{ button }}
        </button>
      </div>
      <div class="button-row">
        <button v-for="button in thirdRow" :key="button" @click="input(button)">
          {{ button }}
        </button>
      </div>
      <div class="button-row">
        <button v-for="button in fourthRow" :key="button" @click="input(button)">
          {{ button }}
        </button>
      </div>
      <div class="button-row">
        <button v-for="button in fifthRow" :key="button" @click="input(button)">
          {{ button }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import backgroundImage from '@/assets/images/mycomponent/fh2.jpg';
export default {
  data() {
    return {
      customTitle: '',
      displayValue: '',
      firstRow: ['7', '8', '9', '/', '*'],
      secondRow: ['4', '5', '6', '+', '-'],
      thirdRow: ['1', '2', '3', '%', '('],
      fourthRow: ['0', '.', 'AC', '=', ')'],
      fifthRow: ['x', 'x!', 'sin', 'cos', 'tan', 'log'],
      backgroundUrl: backgroundImage
    };
  },
  methods: {
    input(button) {
      if (button === 'AC') {
        this.displayValue = '';
      } else if (button === '=') {
        try {
          this.displayValue = eval(this.displayValue);
        } catch (e) {
          this.displayValue = 'Error';
        }
      } else if (button === 'x!') {
        this.factorial();
      } else if (button === 'sin') {
        this.displayValue = Math.sin(this.toRadians(this.displayValue));
      } else if (button === 'cos') {
        this.displayValue = Math.cos(this.toRadians(this.displayValue));
      } else if (button === 'tan') {
        this.displayValue = Math.tan(this.toRadians(this.displayValue));
      } else if (button === 'log') {
        this.displayValue = Math.log(this.displayValue);
      } else {
        this.displayValue = this.displayValue === '0' ? button : this.displayValue + button;
      }
    },
    factorial() {
      let n = parseFloat(this.displayValue);
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      this.displayValue = result.toString();
    },
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },
    setBackground(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.backgroundUrl = e.target.result;
          localStorage.setItem('backgroundUrl', this.backgroundUrl); // 存储背景图片URL
        };
        reader.readAsDataURL(file);
      }
    },
    saveTitle() {
      localStorage.setItem('customTitle', this.customTitle); // 存储标题
    }
  },
  created() {
    const savedTitle = localStorage.getItem('customTitle');
    const savedBackgroundUrl = localStorage.getItem('backgroundUrl');
    if (savedTitle) this.customTitle = savedTitle; // 恢复标题
    if (savedBackgroundUrl) this.backgroundUrl = savedBackgroundUrl; // 恢复背景图片URL
  },
  watch: {
    customTitle(newTitle) {
      this.saveTitle(); // 监听标题变化并存储
    },
    backgroundUrl(newUrl) {
      localStorage.setItem('backgroundUrl', newUrl); // 监听背景URL变化并存储
    }
  }
};
</script>

<style scoped>
.calculator {
  width: 300px;
  margin: 0 auto;
  text-align: center;
  border: 2px solid #ADD8E6;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  background-color: #f9f9f9;
  background-size: cover;
  background-position: center;
}
.title input {
  width: calc(100% - 60px); /* Make room for the background button */
  height: 30px;
  font-size: 20px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
}
.background-button {
  cursor: pointer;
  margin-left: 10px;
  font-size: 10px;
  color: #007BFF;
  text-decoration: underline;
  vertical-align: top;
  line-height: 30px; /* Align with the title input */
}
.display {
  width: 100%;
  height: 50px;
  font-size: 24px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 1px;
}
.buttons {
  display: flex;
  flex-direction: column;
}
.button-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
button {
  flex: 1;
  height: 40px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  margin: 0 1px;
}
button:hover {
  background-color: #e0e0e0;
}
</style>
