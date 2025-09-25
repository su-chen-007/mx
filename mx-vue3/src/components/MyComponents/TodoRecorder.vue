<template>
  <div class="todo-container" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <div class="header">
      <input
        type="text"
        class="header-input"
        v-model="containerName"
        placeholder="自定义待办组件名"
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
import backgroundImagePng from '@/assets/images/mycomponent/toDoBG.png';
import { Chrome } from 'vue-color';
import db from "@/db/index";

export default {
  name:"MyComponentTodoRecorder",
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      newTodo: '',
      todos: [],
      containerName: '又是元气慢慢的一天！！！',
      containerColor: '#ea74b6', // 默认背景颜色
      showColorPicker: false,
      backgroundImage: backgroundImagePng // 存储背景图片的URL
    };
  },
  methods: {
    async restoreBackgroundImage() {
      try {
        const images = await db.ToDoRecorderGlobalBackgroundImage.toArray();
        if (images.length > 0) {
          this.backgroundImage = images[0].picture;
        }
      } catch (error) {
        console.error('Error fetching background images from database:', error);
      }
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
        const reader = new FileReader();
        reader.onload = (e) => {
          this.backgroundImage = e.target.result;
          console.log("存的" + e.target.result);
          // 清除旧数据并存储新数据
          db.ToDoRecorderGlobalBackgroundImage.clear()
              .then(() => {
                // 存储新的背景图片URL
                return db.ToDoRecorderGlobalBackgroundImage.put({
                  picture: e.target.result,
                });
              })
              .then(() => {
                // 确保数据写入后再读取
                return db.ToDoRecorderGlobalBackgroundImage.toArray();
              })
              .then((images) => {
                if (images.length > 0) {
                  console.log("拿的" + images[0].picture);
                } else {
                  console.log("数据库中没有图片数据");
                }
              })
              .catch((error) => {
                console.error("数据库操作出错:", error);
              });
        };
        reader.readAsDataURL(file);
      }
    },
    saveState() {
      localStorage.setItem('containerName', this.containerName);
      localStorage.setItem('containerColor', this.containerColor);
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    restoreState() {
      this.containerName = localStorage.getItem('containerName') || 'My Todo List';
      this.containerColor = localStorage.getItem('containerColor') || '#ea74b6'; // 默认蓝色背景
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }
  },
  mounted() {
    this.restoreBackgroundImage().then(() => {
      this.restoreState();
    });
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
  border: 1px solid #ccc; /* 按钮边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #f0f0f0; /* 按钮背景色 */
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
