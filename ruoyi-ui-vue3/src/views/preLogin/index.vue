<template>
  <div class="container" :style="{ backgroundImage: globalBackgroundImage ? `url(${globalBackgroundImage})` : '' }">
    <!-- 居中的横线和按钮 -->
    <div class="horizontal-line">
      <div class="button-container">
        <button class="global-button"  @click="toggleModal">MX</button>
        <button class="global-button"  @click="triggerBackgroundUpload">BG</button>
      </div>
    </div>

    <!-- 图片组件列表模态框 -->
    <transition name="modal">
      <div class="modal" v-if="showModal">
        <div class="modal-content">
          <div v-if="showToast" class="toast">{{ toastMessage }}</div>
          <span class="close" @click="toggleModal">&times;</span>
          <div class="store-title">MX组件商店</div>
          <button class="tab-button" @click="setActiveTab('all')" :class="{ active: activeTab === 'all' }">全部组件</button>
          <button class="tab-button" @click="setActiveTab('normal')" :class="{ active: activeTab === 'normal' }">普通组件</button>
          <button class="tab-button" @click="setActiveTab('ai')" :class="{ active: activeTab === 'ai' }">AI组件</button>
          <ul class="image-list">
            <li v-for="image in images"  @click="addComponent(image.id)" >
              <div class="image-and-name">
                <span class="component-name">{{ image.name }}</span>
                <img :src="image.url" alt="Image" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- 动态添加的组件 -->
    <transition-group name="component-list" tag="div" class="components-container">
      <div v-for="(comp, index) in components" :key="comp.id" class="component-wrapper">
        <component :is="comp.component" :image="comp.image" class="component" @delete-component="removeComponent(index)" />
        <button class="delete-button1" @click="pinComponent(index)">⬆︎</button>
        <button class="delete-button" @click="removeComponent(index)">✖</button>
      </div>
    </transition-group>

    <!-- 文件输入用于上传全局背景 -->
    <input type="file" @change="setGlobalBackgroundImage" style="display: none;" ref="globalBackgroundInput" />
  </div>
</template>

<script>
import TodoRecorder from '@/components/MyComponents/TodoRecorder.vue';
import MyDate from '@/components/MyComponents/MyDate.vue';
import WebPreviewer from '@/components/MyComponents/WebPreviewer.vue';
import Www from '@/components/MyComponents/Www.vue';
import Top from '@/components/MyComponents/Top.vue';
import Search from '@/components/MyComponents/Search.vue';
import MyJson from '@/components/MyComponents/MyJson.vue';
import MyCalculator from '@/components/MyComponents/MyCalculator.vue';

export default {
  components: {
    TodoRecorder,
    MyDate,
    WebPreviewer,
    Www,
    Top,
    Search,
    MyJson,
    MyCalculator
  },
  data() {
    return {
      toastMessage: '',
      showToast: false,
      showModal: false,
      components: [],
      images: [
        { id: 0, url: '/src/assets/images/mycomponent/TodoRecorder.png',name:'待办组件' },
        { id: 1, url: '/src/assets/images/mycomponent/MyDate.png',name:'时间组件' },
        { id: 2, url: '/src/assets/images/mycomponent/WebPreviewer.png',name:'网页多开组件' },
        { id: 3, url: '/src/assets/images/mycomponent/Www.png',name:'网址收藏组件' },
        { id: 4, url: '/src/assets/images/mycomponent/Top.png',name:'自定榜单组件' },
        { id: 5, url: '/src/assets/images/mycomponent/Search.png',name:'搜索组件' },
        { id: 6, url: '/src/assets/images/mycomponent/MyJson.png',name:'Json解析组件' },
        { id: 7, url: '/src/assets/images/mycomponent/fh.png',name:'计算器组件' }
      ],
      componentNames: [ '待办组件', '时间组件', '网页多开组件', '网址收藏组件', '自定榜单组件', '搜索组件', 'Json解析组件', '计算器组件'],
      nextId: 0,
      showGlobalBackgroundModal: false,
      globalBackgroundImage: '',
      activeTab: 'all'
    };
  },
  methods: {
    shouldShowComponent(index) {
      const allTab = this.activeTab === 'all';
      const isNormalTab = this.activeTab === 'normal';
      const isAITab = this.activeTab === 'ai';
      return (allTab && ['时间组件', '搜索组件', '计算器组件', '待办组件', '网页多开组件', '网址收藏组件', '自定榜单组件', 'Json解析组件'].includes(this.componentNames[index])) || (isNormalTab && ['时间组件', '待办组件', '网页多开组件', '自定榜单组件', 'Json解析组件'].includes(this.componentNames[index])) ||
          (isAITab && this.componentNames[index] === '网址收藏组件');
    },
    pinComponent(index) {
      // 将选中的组件移动到数组的第一个位置
      const [componentToPin] = this.components.splice(index, 1);
      this.components.unshift(componentToPin);
      this.saveLayout();
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    addComponent(index) {
      const componentType = this.componentNames[index];
      const ComponentClass = this.getComponentByName(componentType);
      this.components.push({
        id: this.nextId++,
        component: ComponentClass,
        image: this.images[index]
      });
      this.saveLayout();
      this.toastMessage = "mx组件添加成功";
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 1000); // 1秒后隐藏提示
    },
    removeComponent(index) {
      this.components.splice(index, 1);
      this.saveLayout();
    },
    getComponentByName(name) {
      switch (name) {
        case '时间组件':
          return MyDate;
        case '待办组件':
          return TodoRecorder;
        case '网页多开组件':
          return WebPreviewer;
        case '网址收藏组件':
          return Www;
        case '自定榜单组件':
          return Top;
        case '搜索组件':
          return Search;
        case 'Json解析组件':
          return MyJson;
        case '计算器组件':
          return MyCalculator;
        default:
          return null;
      }
    },
    triggerBackgroundUpload() {
      this.$refs.globalBackgroundInput.click();
    },
    setGlobalBackgroundImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.globalBackgroundImage = URL.createObjectURL(file);
        this.saveLayout();
      }
    },
    saveLayout() {
      localStorage.setItem('userLayout', JSON.stringify(this.components));
      localStorage.setItem('globalBackgroundImage', this.globalBackgroundImage);
    },
    getComponentByImageName(name){
      if(name===undefined){return };
      console.log(name);
      switch (name.url) {
        case '/src/assets/images/mycomponent/MyDate.png':
          return MyDate;
        case '/src/assets/images/mycomponent/TodoRecorder.png':
          return TodoRecorder;
        case '/src/assets/images/mycomponent/WebPreviewer.png':
          return WebPreviewer;
        case '/src/assets/images/mycomponent/Www.png':
          return Www;
        case '/src/assets/images/mycomponent/Top.png':
          return Top;
        case '/src/assets/images/mycomponent/Search.png':
          return Search;
        case '/src/assets/images/mycomponent/MyJson.png':
          return MyJson;
        case '/src/assets/images/mycomponent/fh.png':
          return MyCalculator;
        default:
          return Search;
      }
    },
    setActiveTab(tab) {
      console.log(tab);
      this.activeTab = tab;
      if(tab==='all'){
        this.images=[
          { id: 0, url: '/src/assets/images/mycomponent/TodoRecorder.png',name:'待办组件' },
          { id: 1, url: '/src/assets/images/mycomponent/MyDate.png',name:'时间组件' },
          { id: 2, url: '/src/assets/images/mycomponent/WebPreviewer.png',name:'网页多开组件' },
          { id: 3, url: '/src/assets/images/mycomponent/Www.png',name:'网址收藏组件' },
          { id: 4, url: '/src/assets/images/mycomponent/Top.png',name:'自定榜单组件' },
          { id: 5, url: '/src/assets/images/mycomponent/Search.png',name:'搜索组件' },
          { id: 6, url: '/src/assets/images/mycomponent/MyJson.png',name:'Json解析组件' },
          { id: 7, url: '/src/assets/images/mycomponent/fh.png',name:'计算器组件' }
        ]
      }
      if(tab==='ai'){
        this.images=[
          { id: 6, url: '/src/assets/images/mycomponent/MyJson.png',name:'Json解析组件' },
          { id: 7, url: '/src/assets/images/mycomponent/fh.png',name:'计算器组件' }
        ]
      }
      if(tab==='normal'){
        this.images=[
          { id: 0, url: '/src/assets/images/mycomponent/TodoRecorder.png',name:'待办组件' },
          { id: 1, url: '/src/assets/images/mycomponent/MyDate.png',name:'时间组件' },
          { id: 2, url: '/src/assets/images/mycomponent/WebPreviewer.png',name:'网页多开组件' },
          { id: 3, url: '/src/assets/images/mycomponent/Www.png',name:'网址收藏组件' },
          { id: 4, url: '/src/assets/images/mycomponent/Top.png',name:'自定榜单组件' },
          { id: 5, url: '/src/assets/images/mycomponent/Search.png',name:'搜索组件' }
        ]
      }
      // 这里可以添加逻辑来根据激活的标签过滤显示组件列表
    },
    restoreLayout() {
      const layout = localStorage.getItem('userLayout');
      if (layout) {
        const restoredComponents = JSON.parse(layout);
        this.components = restoredComponents.map(comp => ({
          ...comp,
          component: this.getComponentByImageName(comp.image)
        }));
      }
      this.globalBackgroundImage = localStorage.getItem('globalBackgroundImage') || '';
    }
  },
  created() {
    this.restoreLayout();
  }
};
</script>

<style scoped>


.container {
    overflow-y: auto;
}

.global-button {
  padding: 10px 20px; /* 统一按钮内边距 */
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px; /* 按钮之间的外边距 */
  border: 1px solid #ccc; /* 按钮边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #f0f0f0; /* 按钮背景色 */
}

.horizontal-line {
  width: 100%;
  height: 2px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
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
  height: calc(100vh - 100px); /* 假设你希望容器高度减去顶部的100px空间 */
}

.component-wrapper {
  position: relative;
  margin: 10px;
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


</style>
