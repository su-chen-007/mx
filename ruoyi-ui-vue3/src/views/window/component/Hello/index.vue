<script setup lang="ts">
import { inject } from "vue";
import { System } from "vtron";
import { BrowserWindow } from "vtron";
let browserWindow = inject<BrowserWindow>("browserWindow");
const sys = inject<System>("system");
// 监听窗口的部分事件
browserWindow.on("move", (...arg: any) => {
  console.log("move", arg);
});
browserWindow.on("resize", (...arg: any) => {
  console.log("resize", arg);
});
browserWindow.on("minimize", (...arg: any) => {
  console.log("minimize", arg);
});
</script>

<template>
  <div class="app">
    <h1>HelloWorld1</h1>
  </div>
</template>

<style scoped lang="less"></style>
