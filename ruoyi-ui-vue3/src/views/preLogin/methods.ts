import type { AllComponentInfoProps } from "./types";
import TodoRecorderPng from "@/assets/images/mycomponent/TodoRecorder.png";
import MyDatePng from "@/assets/images/mycomponent/MyDate.png";
import WebPreviewerPng from "@/assets/images/mycomponent/WebPreviewer.png";
import WwwPng from "@/assets/images/mycomponent/Www.png";
import TopPng from "@/assets/images/mycomponent/Top.png";
import SearchPng from "@/assets/images/mycomponent/Search.png";
import MyJsonPng from "@/assets/images/mycomponent/MyJson.png";
import fhPng from "@/assets/images/mycomponent/fh.png";
import lovePng from "@/assets/images/mycomponent/love.png";
export enum ComponentCategory {
  normal, //普通组件
  ai, //ai组件
}
//所有的组件信息
export const AllComponentInfo: AllComponentInfoProps[] = [
  {
    name: "MyComponentTodoRecorder",
    label: "待办组件",
    preview: TodoRecorderPng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentDate",
    label: "时间组件",
    preview: MyDatePng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentWebPreviewer",
    label: "网页多开组件",
    preview: WebPreviewerPng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentWww",
    label: "网址收藏组件",
    preview: WwwPng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentTop",
    label: "自定榜单组件",
    preview: TopPng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentSearch",
    label: "搜索组件",
    preview: SearchPng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentJSONParse",
    label: "Json解析组件",
    preview: MyJsonPng,
    type: ComponentCategory.ai,
  },
  {
    name: "MyComponentCalculator",
    label: "计算器组件",
    preview: fhPng,
    type: ComponentCategory.ai,
  },
  {
    name: "MyComponentLove",
    label: "动态爱心表白组件",
    preview: lovePng,
    type: ComponentCategory.normal,
  },
];
