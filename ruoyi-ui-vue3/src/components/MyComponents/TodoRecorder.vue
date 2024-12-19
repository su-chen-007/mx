<template>
  <div class="todo-container" :style="{ backgroundColor: containerColor, backgroundImage: backgroundImage ? `url(${backgroundImage})` : '' }">
    <div class="header">
      <input
        type="text"
        class="header-input"
        v-model="containerName"
        placeholder="自定义待办组件名"
      />
      <!-- 颜色选择按钮 -->
      <button class="color-change-btn" @click="showColorPicker = true;">背景颜色选择</button>
      <chrome-picker
        v-if="showColorPicker"
        v-model="containerColor"
        class="color-picker"
        @input="colorChanged"
      />
      <!-- 上传图片背景按钮 -->
      <button class="background-change-btn" @click="triggerFileInput">上传背景图片</button>
      <input
        type="file"
        ref="backgroundImageInput"
        style="display: none"
        @change="setBackgroundImage"
      />
    </div>
    <input
      type="text"
      class="todo-input"
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="来添加你今日的待办 添加完按回车"
    />
    <ul>
      <li v-for="(todo, index) in todos" :key="index"
          :class="{ completed: todo.completed }"
      >
        <template v-if="!todo.editing">
          {{ todo.text }}
          <button @click="editTodo(index)">修改</button>
          <button @click="completeTodo(index)">标记完成</button>
          <button @click="deleteTodo(index)">删除</button>
        </template>
        <template v-else>
          <input
            type="text"
            v-model="todo.text"
            @blur="todo.editing = false; saveState()"
            @keyup.enter="todo.editing = false; saveState()"
          />
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
  name:"MyComponentTodoRecorder",
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      newTodo: '',
      todos: [],
      containerName: 'My Todo List',
      containerColor: '#ea74b6', // 默认蓝色背景
      showColorPicker: false,
      backgroundImage: '' // 存储背景图片的URL
    };
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim() !== '') {
        this.todos.push({
          text: this.newTodo,
          completed: false,
          editing: false
        });
        this.newTodo = '';
        this.saveState();
      }
    },
    editTodo(index) {
      this.todos[index].editing = true;
    },
    completeTodo(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveState();
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.saveState();
    },
    colorChanged(color) {
      this.containerColor = color.hex;
      this.backgroundImage = ''; // 选择颜色时重置背景图片
      this.showColorPicker = false;
      this.saveState();
    },
    triggerFileInput() {
      this.$refs.backgroundImageInput.click();
    },
    setBackgroundImage(event) {
      const file = event.target.files[0];
      if (file) {
        // 使用 URL.createObjectURL 创建文件的URL
        this.backgroundImage = URL.createObjectURL(file);
        this.containerColor = ''; // 选择图片背景时重置颜色
        this.showColorPicker = false;
        this.saveState();
      }
    },
    saveState() {
      localStorage.setItem('containerName', this.containerName);
      localStorage.setItem('containerColor', this.containerColor);
      localStorage.setItem('todos', JSON.stringify(this.todos));
      localStorage.setItem('backgroundImage', this.backgroundImage);
    },
    restoreState() {
      this.containerName = localStorage.getItem('containerName') || 'My Todo List';
      this.containerColor = localStorage.getItem('containerColor') || '#ea74b6'; // 默认蓝色背景
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
      this.backgroundImage = localStorage.getItem('backgroundImage') || '';
    }
  },
  mounted() {
    this.restoreState();
  },
  beforeDestroy() {
    // 释放背景图片的URL
    if (this.backgroundImage.startsWith('blob:')) {
      URL.revokeObjectURL(this.backgroundImage);
    }
  },
};
</script>

<style scoped>
.todo-container {
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  cursor: default;
  overflow: auto;
  width: 590px; /* 固定宽度 */
  height: 400px; /* 固定高度 */
  margin: 10px; /* 添加外边距 */
  position: relative; /* 为背景图片定位 */
  background-size: cover; /* 确保背景图片覆盖整个容器 */
  background-position: center; /* 确保背景图片居中显示 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background: #eee;
  padding: 5px;
}

.header-input {
  flex-grow: 1;
  margin-right: 10px;
}

.todo-input {
  width: calc(100% - 20px);
  margin-top: 10px;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

button {
  margin-left: 10px;
}

.completed {
  text-decoration: line-through;
}

.color-change-btn {
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}

.color-picker {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
}
</style>
