<template>
  <div class="container" :style="{ backgroundImage: `url(${globalBackgroundImage})` }">
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
          <span class="close" @click="toggleModal">&times;</span>
          <div class="store-title">MX组件商店</div>
          <button class="tab-button" @click="setActiveTab('all')" :class="{ active: activeTab === 'all' }">全部组件</button>
          <button class="tab-button" @click="setActiveTab('normal')" :class="{ active: activeTab === 'normal' }">普通组件</button>
          <button class="tab-button" @click="setActiveTab('ai')" :class="{ active: activeTab === 'ai' }">AI组件</button>
          <ul class="image-list">
            <li v-for="(image, index) in images" :key="index" v-if="shouldShowComponent(index, activeTab)" @click="addComponent(index)">
              <div class="image-and-name">
                <span class="component-name">{{ componentNames[index] }}</span>
                <img :src="image" alt="Image" />
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
        <button class="delete-button" @click="removeComponent(index)">X</button>
      </div>
    </transition-group>

    <!-- 文件输入用于上传全局背景 -->
    <input type="file" @change="setGlobalBackgroundImage" style="display: none;" ref="globalBackgroundInput" />
  </div>
</template>

<script>
import TodoRecorder from './MyComponents/TodoRecorder.vue';
import MyDate from './MyComponents/MyDate.vue';
import WebPreviewer from './MyComponents/WebPreviewer.vue';
import Www from './MyComponents/Www.vue';
import Top from './MyComponents/Top.vue';

export default {
  components: {
    TodoRecorder,
    MyDate,
    WebPreviewer,
    Www,
    Top
  },
  data() {
    return {
      showModal: false,
      components: [],
      images: [
        require('@/assets/images/mycomponent/MyDate.png'),
        require('@/assets/images/mycomponent/TodoRecorder.png'),
        require('@/assets/images/mycomponent/WebPreviewer.png'),
        require('@/assets/images/mycomponent/Www.png'),
        require('@/assets/images/mycomponent/Top.png')
      ],
      componentNames: ['时间组件', '待办组件', '网页多开组件', '网址收藏组件', '自定榜单组件'],
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
      return (allTab && ['时间组件', '待办组件', '网页多开组件', '网址收藏组件', '自定榜单组件'].includes(this.componentNames[index])) || (isNormalTab && ['时间组件', '待办组件', '网页多开组件', '自定榜单组件'].includes(this.componentNames[index])) ||
        (isAITab && this.componentNames[index] === '网址收藏组件');
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
        const reader = new FileReader();
        reader.onload = (e) => {
          this.globalBackgroundImage = e.target.result;
          this.saveLayout();
        };
        reader.readAsDataURL(file);
      }
    },
    saveLayout() {
      localStorage.setItem('userLayout', JSON.stringify(this.components));
      localStorage.setItem('globalBackgroundImage', this.globalBackgroundImage);
    },
    getComponentByImageName(name){
      console.log(name);
      switch (name) {
        case '/static/img/MyDate.a7c4de4f.png':
          return MyDate;
        case '/static/img/TodoRecorder.f063fe7f.png':
          return TodoRecorder;
        case '/static/img/WebPreviewer.078da9d2.png':
          return WebPreviewer;
        case '/static/img/Www.bd16945a.png':
          return Www;
        case '/static/img/Top.2aa5dde6.png':
          return Top;
        default:
          return null;
      }
    },
    setActiveTab(tab) {
      console.log(tab);
      this.activeTab = tab;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.component-wrapper {
  position: relative;
  margin: 10px;
}

.component {
  margin-bottom: 10px;
}

.delete-button {
  position: absolute;
  top: 0;
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


</style>
