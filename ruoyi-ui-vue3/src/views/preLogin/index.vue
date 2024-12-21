<template>
  <div class="container" :style="{ backgroundImage: `url(${info.globalBackgroundImage})` }">
    <!--<div class="flex gap-2 text-center">-->
    <!--  <el-button>MX</el-button>-->
    <!--  <el-button>BG</el-button>-->
    <!--  <el-button>DE5BG</el-button>-->
    <!--</div>-->
    <!-- 居中的横线和按钮 -->
    <div class="horizontal-line">
      <div class="button-container">
        <button class="global-button" @click="toggleModal">MX</button>
        <button class="global-button" @click="triggerBackgroundUpload">BG</button>
        <button class="global-button" @click="dlBackgroundUpload">清除缓存(有问题请点)</button>
      </div>
    </div>

    <!-- 图片组件列表模态框 -->
    <transition name="modal">
      <div class="modal" v-if="info.showModal">
        <div class="modal-content">
          <div v-if="info.showToast" class="toast">{{ info.toastMessage }}</div>
          <span class="close" @click="toggleModal">&times;</span>
          <div class="store-title">MX组件商店</div>
          <button class="tab-button" @click="setActiveTab('')" :class="{ active: info.activeTab === '' }">全部组件</button>
          <button class="tab-button" @click="setActiveTab(ComponentCategory.normal)" :class="{ active: info.activeTab === ComponentCategory.normal }">普通组件</button>
          <button class="tab-button" @click="setActiveTab(ComponentCategory.ai)" :class="{ active: info.activeTab === ComponentCategory.ai }">AI组件</button>
          <ul class="image-list">
            <li v-for="item in showComponentList" :key="item.name" @click="handleAddComponent(item)">
              <div class="image-and-name">
                <span class="component-name">{{ item.label }}</span>
                <img :src="item.preview" alt="Image" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- 动态添加的组件 -->
    <transition-group name="component-list" tag="div" class="components-container">
      <div v-for="(comp, index) in userStoreInfo.layout" :key="comp.id" class="component-wrapper">
        <component :is="comp.name" @delete-component="removeComponent(comp)" />
        <button class="delete-button1" @click="pinComponent(comp)">⬆︎</button>
        <button class="delete-button" @click="removeComponent(comp)">✖</button>
      </div>
    </transition-group>
    <!-- 底部备案信息 -->
    <!-- 文件输入用于上传全局背景 -->
    <input type="file" @change="setGlobalBackgroundImage" style="display: none" ref="globalBackgroundInputRef" />
    <div class="particle-background" v-if="!info.globalBackgroundImage">
      <!-- 粒子背景 -->
      <!--<ParticleBackground />-->
    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备2024352002号</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AllComponentInfo, ComponentCategory } from "./methods";
import { reactive, onMounted, ref, computed, nextTick } from "vue";
import type { AllComponentInfoProps } from "@/views/preLogin/types";
import userStore from "@/stores/user";
import ParticleBackground from "@/components/MyComponents/ParticleBackground.vue";
import { fileToBase64 } from "@/utils/file";
import db from "@/db/index";
import { ulid } from "ulid";
import type { LayoutTypes } from "@/stores/types";
const userStoreInfo = userStore();
const globalBackgroundInputRef = ref();
onMounted(async () => {
  const picList = await db.globalBackgroundImage.limit(1).toArray();
  info.globalBackgroundImage = picList[0]?.picture;
});
const info = reactive<any>({
  toastMessage: "", //提示信息
  filterType: "", //筛选类型
  showToast: false,
  showModal: false,
  showGlobalBackgroundModal: false,
  globalBackgroundImage: "",
  activeTab: "", //当前组件类型
});
const storageGlobalImage = async (base64Data: string) => {
  //清空所有背景图
  await db.globalBackgroundImage.clear();
  //设置背景图
  await db.globalBackgroundImage.put({
    picture: base64Data,
  });
};
const showComponentList = computed(() => {
  if (info.filterType === "") {
    return AllComponentInfo;
  } else {
    return AllComponentInfo.filter((item: any) => item.type === info.filterType);
  }
});
// 点击添加组件
const handleAddComponent = (item: AllComponentInfoProps) => {
  userStoreInfo.layout.push({
    name: item.name,
    id: ulid(),
  });
  info.toastMessage = "mx组件添加成功";
  info.showToast = true;
  setTimeout(() => {
    info.showToast = false;
  }, 1000); // 1秒后隐藏提示
};
// 将选中的组件移动到数组的第一个位置
const pinComponent = (comp: LayoutTypes) => {
  const index = userStoreInfo.layout.findIndex((item) => item.id === comp.id);
  if (index !== -1) {
    userStoreInfo.layout.unshift(userStoreInfo.layout.splice(index, 1)[0]);
  }
};
const toggleModal = () => {
  info.showModal = !info.showModal;
};
//移除组件
const removeComponent = (comp: LayoutTypes) => {
  userStoreInfo.layout = userStoreInfo.layout.filter((item) => item.id !== comp.id);
};
const triggerBackgroundUpload = () => {
  globalBackgroundInputRef.value.click();
};
const dlBackgroundUpload = () => {
  db.globalBackgroundImage.clear();
  userStoreInfo.layout = [];
  info.globalBackgroundImage = null;
};

const setGlobalBackgroundImage = async (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const result = await fileToBase64(file);
    if (result.status) {
      await storageGlobalImage(result.data);
      info.globalBackgroundImage = result.data;
    } else {
      console.error("error---", result.error);
    }
  }
};
//切换组件类型
const setActiveTab = (type: any) => {
  info.filterType = type;
  info.activeTab = type;
};
</script>

<style scoped>
.particle-background {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* 设置为0试试，根据实际情况调整 */
}

.global-button {
  padding: 10px 20px; /* 统一按钮内边距 */
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px; /* 按钮之间的外边距 */
  border: 1px solid #ccc; /* 按钮边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #f0f0f0; /* 按钮背景色 */
  z-index: 1;
}

.horizontal-line {
  width: 100%;
  height: 2px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* 修改这里 */
  z-index: 1;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  z-index: 1;
}

.modal {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto; /* 添加这行 */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: 350px; /* 固定高度 */
  max-height: 350px; /* 最大高度 */
  max-width: 900px; /* 最大宽度 */
  overflow-y: auto; /* 垂直方向上的滚动条 */
  margin: 20px;
}

.close {
  float: right;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  overflow-x: auto;
}

.image-list li {
  margin: 10px;
  cursor: pointer;
  flex: 0 0 auto;
}

.image-and-name {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-list li img {
  width: 100px;
  height: auto;
  border-radius: 5px;
}

.component-name {
  margin-bottom: 5px;
  font-size: 14px;
  text-align: center;
}

.components-container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - 100px); /* 假设你希望容器高度减去顶部的100px空间 */
  z-index: 1; /* 设置合适的z-index */
}

.component-wrapper {
  position: relative;
  margin: 10px;
  z-index: 1; /* 设置合适的z-index */
}

.component {
  margin-bottom: 10px;
}

.delete-button1 {
  margin-top: 0px;
  position: absolute;
  top: 0px;
  right: 0;
  cursor: pointer;
  padding: 1px 2px;
  font-size: 9px;
  line-height: 1;
  border-radius: 2px;
}

.delete-button {
  margin-top: 10px;
  position: absolute;
  top: 10px;
  right: 0;
  cursor: pointer;
  padding: 1px 2px;
  font-size: 9px;
  line-height: 1;
  border-radius: 2px;
}

.footer {
  margin-top: auto;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.footer a {
  color: #666;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.store-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.global-background-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
}

.pin-button {
  position: absolute;
  top: 0;
  right: 50px; /* 根据需要调整位置 */
  cursor: pointer;
  padding: 1px 2px;
  font-size: 9px;
  line-height: 1;
  border-radius: 2px;
}

.tab-button {
  display: inline-block;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 50%; /* 圆形按钮 */
  background-color: #f8c8dc; /* 粉色背景 */
  cursor: pointer;
  transition: transform 0.3s; /* 添加点击时的动画效果 */
}

.tab-button.active {
  background-color: #d51313; /* 激活标签的背景色 */
  color: #e7e2e2; /* 激活标签的文字色 */
}

.toast {
  position: fixed;
  top: 50%;
  justify-content: center;
  align-items: center;
  background-color: #2fc7b5;
  color: #e6efef;
  border-radius: 10%;
  z-index: 9999; /* 确保提示在最上面 */
}

.container {
  position: relative;
  overflow-y: auto;
  z-index: 1;
  min-height: 100vh;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.footer a {
  color: #eaeaea;
  text-decoration: none;
}
</style>
