import type { App } from "vue";
const install = (Vue: App) => {
  const modules = import.meta.glob(["../components/*/*.vue", "!../components/Crontab/*.vue", "../components/MyComponents/*/*.vue"], {
    eager: true,
  }) as any;
  console.log("modules", modules);
  // 遍历模块并注册为全局组件
  for (const path in modules) {
    console.log("path", path);
    const component = modules[path].default; // 获取模块的默认导出
    if (component && component.name) {
      Vue.component(component.name, component); // 按名称注册组件
    } else {
      console.warn(`组件 ${path} 未设置 name 属性，无法全局注册。`);
    }
  }
  // Object.keys(modules).forEach((item,index) => {
  //   console.log('item',item);
  //   // Vue.component(item.replace(/\.\//,'').replace(/\.vue$/,''),allCom[item].default)
  // })
  // Vue.use(formCreate)
  // Vue.use(fcDesigner)
};

export default install;
