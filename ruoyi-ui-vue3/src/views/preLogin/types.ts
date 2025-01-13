import type { ComponentCategory } from "./methods";

export interface AllComponentInfoProps {
  name: string; //组件注册名(唯一)
  label: string; //组件中文名
  preview: string; //预览图
  type: ComponentCategory; //组件类型
}
