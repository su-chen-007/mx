import type { AllComponentInfoProps } from "./types";
import TodoRecorderPng from "./imagePreview/TodoRecorder.png";
import MyDatePng from "./imagePreview/MyDate.png";
import WebPreviewerPng from "./imagePreview/WebPreviewer.png";
import WwwPng from "./imagePreview/Www.png";
import TopPng from "./imagePreview/Top.png";
import SearchPng from "./imagePreview/Search.png";
import MyJsonPng from "./imagePreview/MyJson.png";
import fhPng from "./imagePreview/fh.png";
import lovePng from "./imagePreview/love.png";
import ScorcePng from "./imagePreview/Scroce.png";
import ClipBoard from "./imagePreview/clipboard.jpg";
import CarouselWithUpload from "./imagePreview/CarouselWithUpload.jpg";
import MyRelationshipBg from "./imagePreview/MyRelationship.png";
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
  {
    name: "MyComponentScroceGame",
    label: "推箱子游戏组件",
    preview: ScorcePng,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentClipboard",
    label: "剪贴板组件",
    preview: ClipBoard,
    type: ComponentCategory.normal,
  },
  {
    name: "MyComponentCarouselWithUpload",
    label: "家的照片轮播组件",
    preview: CarouselWithUpload,
    type: ComponentCategory.normal,
  },
  {
    name: "MyRelationship",
    label: "称呼计算器",
    preview: MyRelationshipBg,
    type: ComponentCategory.normal,
  },
];
