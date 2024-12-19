import type{ App } from "vue";
import formCreate from "@form-create/element-ui";
import fcDesigner from "@form-create/designer";
const install = (Vue: App) => {
  Vue.use(formCreate)
  Vue.use(fcDesigner)
};

export default install;
