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
// 粒子
import Particles from "@tsparticles/vue3";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if


const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(Particles, {
    init: async engine => {
        await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
    },
})
app.use(pinia)
  .use(router)
  .use(ElementInstall) //Element组件
  .use(ComponentGlobalInstall) //
  .use(DirectivesInstall) // 挂载全局指令
  .use(FormCreateInstall) // FormCreate
  .mount("#app")

