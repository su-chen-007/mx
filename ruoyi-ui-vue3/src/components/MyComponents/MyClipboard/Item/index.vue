<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Delete, Edit, Search, Share, Upload, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { Emits, Props } from "./types";
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const truncatedContent = computed(() => {
  return props.content.length > 20 ? props.content.substring(0, 20) + "..." : props.content;
});

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
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
};
const handleDelete = () => {
  emits("delete", props.index);
};
</script>

<template>
  <div class="itemC" @click="handleCopy">
    <div class="itemC_list">
      {{ truncatedContent }}
      <div class="itemC_list_operation">
        <el-popover placement="bottom" :show-after="100" trigger="hover" :popper-style="{ minWidth: '40px', padding: 0, width: 'auto' }">
          <template #reference>
            <el-icon><Edit /></el-icon>
          </template>
          <template #default>
            <div class="flex flex-col">
              <el-tooltip content="复制" :show-after="1000" placement="bottom">
                <el-button type="primary" size="small" text :icon="CopyDocument" @click="handleCopy" />
              </el-tooltip>
              <el-tooltip content="删除" :show-after="1000" placement="bottom">
                <el-button type="primary" size="small" style="margin-left: 0" text :icon="Delete" @click="handleDelete" />
              </el-tooltip>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.itemC {
  box-sizing: border-box;
  padding: 0 10px;
  cursor: pointer;
  &_list {
    box-sizing: border-box;
    height: 60px;
    padding: 6px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 1px;
    position: relative;
    &_operation {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
