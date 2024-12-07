<template>
  <div
    class="todo-container"
    @mousedown="dragStart"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
    @mousemove="dragging"
    :style="{
      top: position.top + 'px',
      left: position.left + 'px',
      width: containerWidth + 'px',
      height: containerHeight + 'px',
      backgroundColor: containerColor
    }"
    ref="container"
  >
    <div class="header">
      <input
        type="text"
        class="header-input"
        v-model="containerName"
      @input="saveState"
      placeholder="自定义待办组件名"
      />
      <button class="color-change-btn" @click="showColorPicker = true">背景颜色选择</button>
      <chrome-picker
        v-if="showColorPicker"
        v-model="containerColor"
        class="color-picker"
        @input="colorChanged"
      />
    </div>
    <input
      type="text"
      class="todo-input"
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="来添加你今日的待办 添加完按回车"
    />
    <div class="resize-handle" @mousedown="resizeStart"></div>
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

/* 第一个自主的待办组件 可复用于任何页面 原创@苏辰 */
/* 1大小随意拖拽 2本地缓存所有数据 刷新不丢失 3自定义颜色 */
export default {
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      newTodo: '',
      todos: [],
      containerName: 'My Todo List',
      containerColor: '#f0f0f0',
      containerWidth: 300,
      containerHeight: 300,
      position: {
        top: 0,
        left: 0
      },
      dragging: false,
      startX: 0,
      startY: 0,
      resize: false,
      resizeStartX: 0,
      resizeStartY: 0,
      showColorPicker: false,
    };
  },
  methods: {
    dragStart(event) {
      this.dragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    dragging(event) {
      if (this.dragging) {
        const deltaX = event.clientX - this.startX;
        const deltaY = event.clientY - this.startY;
        this.position.left += deltaX;
        this.position.top += deltaY;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.saveState(); // Save immediately when dragging
      }
    },
    dragEnd() {
      this.dragging = false;
    },
    resizeStart(event) {
      this.resize = true;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
    },
    resizeMove(event) {
      if (this.resize) {
        const deltaX = event.clientX - this.resizeStartX;
        const deltaY = event.clientY - this.resizeStartY;
        this.containerWidth += deltaX;
        this.containerHeight += deltaY;
        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;
        this.saveState(); // Save immediately when resizing
      }
    },
    resizeEnd() {
      this.resize = false;
    },
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
      this.todos[index].completed = true;
      this.saveState();
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.saveState();
    },
    colorChanged(color) {
      this.containerColor = color.hex;
      this.showColorPicker = false;
      this.saveState();
    },
    saveState() {
      localStorage.setItem('containerName', this.containerName);
      localStorage.setItem('containerColor', this.containerColor);
      localStorage.setItem('containerWidth', this.containerWidth);
      localStorage.setItem('containerHeight', this.containerHeight);
      localStorage.setItem('positionTop', this.position.top);
      localStorage.setItem('positionLeft', this.position.left);
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    restoreState() {
      this.containerName = localStorage.getItem('containerName') || 'My Todo List';
      this.containerColor = localStorage.getItem('containerColor') || '#f0f0f0';
      this.containerWidth = parseInt(localStorage.getItem('containerWidth')) || 300;
      this.containerHeight = parseInt(localStorage.getItem('containerHeight')) || 300;
      this.position.top = parseInt(localStorage.getItem('positionTop')) || 0;
      this.position.left = parseInt(localStorage.getItem('positionLeft')) || 0;
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }
  },
  mounted() {
    this.restoreState();
    document.addEventListener('mousemove', this.resizeMove);
    document.addEventListener('mouseup', this.resizeEnd);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeEnd);
  },
};
</script>

<style scoped>
.todo-container {
  position: absolute;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  cursor: move;
  overflow: auto;
  background-color: #f0f0f0; /* Default background color */
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

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #aaa;
  cursor: se-resize;
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
  background: none;
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
