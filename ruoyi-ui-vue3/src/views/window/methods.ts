import { ulid } from "ulid";
import IconTest from "./images/iconTest.png";

function generateRandomString(length = 5) {
  return Math.random().toString(36).substr(2, length);
}
export const getAllList = () => {
  const list = [];
  // const modules = import.meta.glob(["../../components/*/*.vue", "!../../components/Crontab/*.vue", "../../components/MyComponents/*/*.vue"], {
  const modules = import.meta.glob(["@/components/*/*.vue", "!@/components/Crontab/*.vue", "@/components/MyComponents/*/*.vue"], {
    eager: true,
  }) as any;
  console.log("modules", modules);
  for (const path in modules) {
    const tempId = generateRandomString();
    const component = modules[path].default; // 获取模块的默认导出
    list.push({
      name: component.name.slice(5, component.name.length),
      icon: IconTest,
      window: {
        content: component.name,
        icon: IconTest,
      },
    });
  }
  return list;
};
