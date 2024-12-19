import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "@/assets/styles/index.less";
import myDirective from "@/directive/index"; // directive
import myComponent from "@/components/index"; // component
// svg图标
import "virtual:svg-icons-register";
import myIcons from "@/components/SvgIcon/myIcon";
// formCreate
import formCreate from "@form-create/element-ui";
import fcDesigner from "@form-create/designer";
// 粒子
import Particles from "@tsparticles/vue3";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.

const app = createApp(App);
app.use(createPinia());
app.use(router);
// element plus Icons
for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp);
}
// 自定义icon 转化为 element plus Icons
myIcons.forEach((item) => {
  app.component(item.name, item.component);
});
app.use(ElementPlus);
app.use(myDirective); // 挂载全局指令
app.use(myComponent); // 挂载全局组件
app.use(formCreate);
app.use(fcDesigner);
//使用Particles
app.use(Particles, {
  init: async engine => {
    // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
    await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
  },
})
app.mount("#app");
