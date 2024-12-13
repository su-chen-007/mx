<template>
  <div class="json-editor-container">
    <textarea v-model="inputJson" rows="10" cols="50" placeholder="输入你的json在此..."></textarea>
    <button class="format-btn" @click="formatJson">开始格式化</button>
    <button class="collapse-btn" @click="toggleJsonTree">一键关闭并清理</button>
    <vue-json-editor
      class="vue-json-component"
      v-if="showJsonTree"
      v-model="formattedJson"
      :mode="'tree'"
      :show-btns="false"
      :expandedOnStart="true"
      @json-change="onJsonChange"
      :style="{ backgroundColor: '#f8f4f4' }"
    />
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-editor';

export default {
  components: {
    VueJsonEditor
  },
  data() {
    return {
      inputJson: '',
      formattedJson: null,
      showJsonTree: false // 控制JSON树显示与隐藏的属性
    };
  },
  methods: {
    formatJson() {
      if(this.inputJson ===null){
        alert('输入为空 请检查');
        return;
      }
      try {
        this.showJsonTree = true // 控制JSON树显示与隐藏的属性
        this.formattedJson = JSON.parse(this.inputJson);
      } catch (e) {
        alert('无效的json请检查格式');
        this.showJsonTree = false // 控制JSON树显示与隐藏的属性
        this.formattedJson = null;
      }
    },
    toggleJsonTree() {
      this.showJsonTree = false; // 切换JSON树的显示状态
      this.inputJson = null;
      this.formattedJson = null;
    },
    onJsonChange(value) {
      console.log('JSON changed:', value);
    }
  }
};
</script>

<style scoped>
.json-editor-container {
  width: 800px; /* 设置固定宽度 */
  height: 1600px; /* 设置固定高度 */
  margin: auto;
  overflow: hidden; /* 隐藏溢出的内容 */
  position: relative; /* 相对定位 */
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.format-btn,
.collapse-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: auto; /* Add space between buttons */
}

.format-btn:hover,
.collapse-btn:hover {
  background-color: #45a049;
}

/* 新增样式 */
.vue-json-component {
  height: 1600px; /* 设置最大高度 */
  overflow-y: auto; /* 垂直方向添加滚动条 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: auto;
}

::v-deep .jsoneditor-vue .jsoneditor-outer {
  width: 100%; /* 设置固定宽度 */
  height: 1600px; /* 设置固定高度 */
  overflow-y: auto; /* 垂直方向添加滚动条 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>
