<template>
  <svg viewBox="0 0 1024 1024">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts"  setup>
import { computed } from "vue";
defineOptions({
  name:"CompSvgIcon",
})
const props = withDefaults(
  defineProps<{
    iconClass: string;
  }>(),
  {}
);

const iconName = computed(() => `#icon-${props.iconClass}`);
</script>

<style scope lang="less"></style>
