<template>
  <div class="container">
    <!-- 居中的横线和按钮 -->
    <div class="horizontal-line">
      <div class="button-container">
        <button @click="toggleModal">MX</button>
      </div>
    </div>

    <!-- 图片组件列表模态框 -->
    <transition name="modal">
      <div class="modal" v-if="showModal">
        <div class="modal-content">
          <span class="close" @click="toggleModal">&times;</span>
          <div class="store-title">MX组件商店</div>
          <ul class="image-list">
            <li v-for="(image, index) in images" :key="index" @click="addComponent(index)">
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
      <div
        v-for="(comp, index) in components"
        :key="comp.id"
        class="component-wrapper"
      >
        <component
          :is="comp.component"
          :image="comp.image"
          class="component"
          @delete-component="removeComponent(index)"
        />
        <button class="delete-button" @click="removeComponent(index)">X</button>
      </div>
    </transition-group>

    <!-- 备案信息 -->
    <footer class="footer">
      <a href="http://beian.miit.gov.cn" target="_blank">关于MX 域名备案编号：XXXXXX</a>
    </footer>
  </div>
</template>

<script>
import TodoRecorder from './MyComponents/TodoRecorder.vue';
import MyDate from './MyComponents/MyDate.vue';
import WebPreviewer from './MyComponents/WebPreviewer.vue';
import Www from './MyComponents/Www.vue';


export default {
  components: {
    TodoRecorder,
    MyDate,
    WebPreviewer,
    Www
  },
  data() {
    return {
      showModal: false,
      components: [],
      images: [
        require('@/assets/images/mycomponent/MyDate.png'),
        require('@/assets/images/mycomponent/TodoRecorder.png'),
        require('@/assets/images/mycomponent/WebPreviewer.png'),
        require('@/assets/images/mycomponent/Www.png')
      ],
      componentNames: ['时间组件', '待办组件', '网页多开组件', '网址收藏组件'],
      nextId: 0
    };
  },
  methods: {
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
      console.log(name);
      switch (name) {
        case '时间组件':
          return MyDate;
        case '待办组件':
          return TodoRecorder;
        case '网页多开组件':
          return WebPreviewer;
        case '网址收藏组件':
          return Www;
        default:
          return null;
      }
    },
    saveLayout() {
      const layout = JSON.stringify(this.components);
      localStorage.setItem('userLayout', layout);
    },
    restoreLayout() {
      const layout = localStorage.getItem('userLayout');
      console.log(layout);
      if (layout) {
        const restoredComponents = JSON.parse(layout);
        this.components = restoredComponents.map(comp => ({
          ...comp,
          component: this.getComponentByImageName(comp.image)
        }));
      }
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
        default:
          return null;
      }
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
</style>
