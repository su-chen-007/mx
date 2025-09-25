<script setup lang="ts">
import { ref } from "vue";
import { tify, sify } from "chinese-conv";
import { ElMessage } from "element-plus";
defineOptions({
  name: "MySimpleToTradition",
});
const textarea = ref<string>("");
const handleToTradition = () => {
  textarea.value = tify(textarea.value);
};
const handleToSimple = () => {
  textarea.value = sify(textarea.value);
};
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(textarea.value);
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
const handleClear = () => {
  textarea.value = "";
};
</script>

<template>
  <div class="simpleToTradition">
    <el-input v-model="textarea" :rows="6" type="textarea" style="font-size: 12px" placeholder="请输入要转换的文本" />
    <!--按钮列表-->
    <div class="mt-1 flex gap-2 justify-center">
      <el-button size="small" @click="handleToTradition">转繁体</el-button>
      <el-button size="small" @click="handleToSimple">转简体</el-button>
      <el-button size="small" @click="handleCopy">复制</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.simpleToTradition {
  width: 300px;
  text-align: center;
}
</style>
