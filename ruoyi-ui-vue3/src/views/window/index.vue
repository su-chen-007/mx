<script setup lang="ts">
import { BrowserWindow, System, VtronComputer } from "vtron";
import { ref, onBeforeMount } from "vue";
import HelloVue from "./component/Hello/index.vue";
import MyClipboard from "@/components/MyComponents/MyClipboard/index.vue";
import MyComponentDate from "@/components/MyComponents/MyDate.vue";
import MyComponentWww from "@/components/MyComponents/Www.vue";
import IconTest from "./images/iconTest.png";

import { getAllList } from "@/views/window/methods";
// const systemList = [];
// import { ulid } from "ulid";
// Array.from({ length: 4 }).forEach((value) => {
//   console.log("value", value);
//   let system = new System({
//     id: Math.random(),
//     desktop: [
//       {
//         name: ulid(),
//         icon: IconTest,
//         window: {
//           content: HelloVue,
//           icon: IconTest,
//           skipTaskbar: true,
//         },
//       },
//     ],
//   });
//   systemList.push(system);
// });
const ttt = getAllList() as any;
console.log("ttt", ttt);
let system = new System({
  id: Math.random(),
  desktop: [
    {
      name: "剪贴板",
      icon: IconTest,
      window: {
        content: MyClipboard,
        icon: IconTest,
        width: 400,
        height: 400,
        resizable: false,
      },
    },
    {
      name: "时间组件",
      icon: IconTest,
      window: {
        content: MyComponentDate,
        icon: IconTest,
        width: 400,
        height: 400,
        resizable: false,
      },
    },
    {
      name: "网址收藏组件",
      icon: IconTest,
      window: {
        content: MyComponentWww,
        icon: IconTest,
        resizable: false,
      },
    },
  ],
});
const handleCreate = () => {
  // system.fs.mkdir("/C/Users/Desktop/归类文件夹");
  // system.fs.rename("/C/Users/Desktop/HelloVue111.exe", "/C/Users/Desktop/归类文件夹/HelloVue111.exe");
};
</script>

<template>
  <div class="outer">
    <!--<el-carousel height="100vh" direction="vertical" :autoplay="false" trigger="click">-->
    <!--  <el-carousel-item v-for="(item, index) in 4" :key="item">-->
    <!--    <div class="bg-amber-100" style="height: 100%">-->
    <!--      <VtronComputer :system="systemList[index]"></VtronComputer>-->
    <!--    </div>-->
    <!--  </el-carousel-item>-->
    <!--</el-carousel>-->
    <VtronComputer :system="system"></VtronComputer>
    <!--<button @click="handleCreate">测试</button>-->
    <!--<button @click="createWindow2">创建窗口</button>-->
  </div>
</template>

<style scoped lang="less">
.outer {
  width: 100vw;
  height: 100vh;
}
:deep(.el-carousel__indicator) {
  background-color: pink;
}
</style>
