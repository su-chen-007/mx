import type { App } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import myIcons from "@/components/SvgIcon/myIcon";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const install = (Vue: App) => {
  // 自定义icon 转化为 element plus Icons
  myIcons.forEach((item) => {
    Vue.component(item.name, item.component);
  });
  // element plus Icons
  for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(name, comp);
  }
  Vue.use(ElementPlus);
};

export default install;
