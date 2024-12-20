<script setup lang="ts">
const props = defineProps<{
  content: any;
}>();
</script>

<template>
  <div class="itemC">
    <div class="itemC_list" v-html="content"></div>
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
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  }
}
</style>
