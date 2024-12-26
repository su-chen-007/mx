import { ElMessage } from "element-plus";

export async function copyTxt(txt: string) {
  try {
    await navigator.clipboard.writeText(txt);
    ElMessage({
      message: "复制成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: "请检查是否允许复制",
      type: "error",
    });
  }
}
