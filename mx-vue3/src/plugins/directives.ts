import type{ App } from "vue";
// 自定义指令
import MyDirective from "@/directive/index";

const install = (Vue: App) => {
  Vue.use(MyDirective)
};

export default install;
