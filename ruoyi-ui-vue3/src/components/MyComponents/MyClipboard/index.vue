<script setup lang="ts">
import Item from "./Item/index.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
defineOptions({
  name: "MyComponentClipboard",
});
//剪贴板列表
const clipList = ref([]);
//粘贴
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    ElMessage({
      message: "粘贴成功",
      type: "success",
    });
    console.log("内容", text);
    clipList.value.push(text);
  } catch (e) {
    ElMessage({
      message: "请检查是否允许粘贴",
      type: "error",
    });
  }
};
const handleClick = async (item) => {
  try {
    await navigator.clipboard.writeText(item);
    ElMessage({
      message: "复制成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: "请检查是否允许复制",
      type: "error",
    });
  }
};
</script>

<template>
  <div class="myClipboard">
    <div class="operation"><el-button @click="handlePaste">存储当前复制</el-button></div>
    <div class="wrapper">
      <!--列表-->
      <div class="item" v-for="(item, index) in clipList" :key="index">
        <Item :content="item" @click="handleClick(item)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.myClipboard {
  width: 400px;
  height: 400px;
  border: 3px solid #5385ec;
  background: white;
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
