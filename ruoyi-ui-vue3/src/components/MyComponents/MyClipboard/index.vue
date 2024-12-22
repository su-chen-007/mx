<script setup lang="ts">
import Item from "./Item/index.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useStorage } from "@vueuse/core";
defineOptions({
  name: "MyComponentClipboard",
});
//剪贴板列表
const clipList = useStorage("MyComponentClipboardState", []);
//粘贴
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    console.log("text", text);
    ElMessage({
      message: "粘贴成功",
      type: "success",
    });
    clipList.value.push(text);
  } catch (e) {
    ElMessage({
      message: "请检查是否允许粘贴",
      type: "error",
    });
  }
};
//删除
const handleDelete = (index: number) => {
  clipList.value.splice(index, 1);
};
</script>

<template>
  <div class="myClipboard">
    <div class="operation"><el-button @click="handlePaste">存储当前复制</el-button></div>
    <div class="wrapper">
      <!--列表-->
      <div class="item" v-for="(item, index) in clipList" :key="index">
        <Item :content="item" :index="index" @delete="handleDelete" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.myClipboard {
  width: 400px;
  height: 400px;
  border: 1px solid black;
  background: #d4dff2;
  display: flex;
  flex-direction: column;
  .operation {
    padding: 0 20px;
    text-align: right;
  }
  .wrapper {
    height: 0;
    flex: 1;
    overflow-y: auto;
  }
  .item {
    margin: 10px 0;
  }
}
</style>
