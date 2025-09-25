import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementInstall from "@/plugins/element";
import FormCreateInstall from "@/plugins/formCreate";
import ComponentGlobalInstall from "@/plugins/component";
import ParticlesInstall from "@/plugins/particles";
import "@/assets/styles/index.less";
import DirectivesInstall from "@/plugins/directives";
// svg图标
import "virtual:svg-icons-register";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "@/assets/styles/tailwind.css";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app
  .use(pinia)
  .use(router)
  .use(ParticlesInstall) //粒子组件
  .use(ElementInstall) //Element组件
  .use(ComponentGlobalInstall) //
  .use(DirectivesInstall) // 挂载全局指令
  .use(FormCreateInstall) // FormCreate
  .mount("#app");
