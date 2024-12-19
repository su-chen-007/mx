import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementInstall from "@/plugins/element";
import FormCreateInstall from "@/plugins/formCreate"
import ComponentGlobalInstall from "@/plugins/component"
import "@/assets/styles/index.less";
import DirectivesInstall from "@/plugins/directives"
// svg图标
import "virtual:svg-icons-register";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
  .use(router)
  .use(ElementInstall) //Element组件
  .use(ComponentGlobalInstall) //
  .use(DirectivesInstall) // 挂载全局指令
  .use(FormCreateInstall) // FormCreate
  .mount("#app")

