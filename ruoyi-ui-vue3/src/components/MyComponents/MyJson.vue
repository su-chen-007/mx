<template>
  <div class="json-editor-container">
    <textarea v-model="inputJson" rows="10" cols="50" placeholder="输入你的json在此..."></textarea>
    <button class="format-btn" @click="formatJson">开始格式化</button>
    <button class="collapse-btn" @click="toggleJsonTree">一键关闭并清理</button>
    <JsonEditorVue
        class="vue-json-component"
        v-if="showJsonTree"
        v-model="formattedJson"
        :mode="'code'"
        :show-btns="false"
        :expanded-on-start="true"
        @json-change="onJsonChange"
        :style="{ backgroundColor: '#f8f4f4' }"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import JsonEditorVue from 'json-editor-vue3';

export default {
  name:"MyComponentJSONParse",
  components: {
    JsonEditorVue
  },
  setup() {
    const inputJson = ref('');
    const formattedJson = ref(null);
    const showJsonTree = ref(false);

    const formatJson = () => {
      if (inputJson.value === '') {
        alert('输入为空，请检查');
        return;
      }
      try {
        showJsonTree.value = true;
        formattedJson.value = JSON.parse(inputJson.value);
      } catch (e) {
        alert('无效的json，请检查格式');
        showJsonTree.value = false;
        formattedJson.value = null;
      }
    };

    const toggleJsonTree = () => {
      showJsonTree.value = false;
      inputJson.value = '';
      formattedJson.value = null;
    };

    const onJsonChange = (value) => {
      console.log('JSON changed:', value);
    };

    return {
      inputJson,
      formattedJson,
      showJsonTree,
      formatJson,
      toggleJsonTree,
      onJsonChange
    };
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
</style>
