<template>
  <div class="web-previewer">
    <input v-model="url" @keyup.enter="loadUrl" placeholder="Enter URL and press Enter">
    <button @click="loadUrl">刷新网页</button>
    <div class="iframe-container" ref="iframeContainer" @mousedown="dragStart">
      <iframe :src="url" frameborder="0" @load="onIframeLoad"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "WebPreviewer",
  data() {
    return {
      url: '',
      dragging: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0
    };
  },
  methods: {
    loadUrl() {
      this.saveUrlToStorage();
      this.$refs.iframe.src = this.url;
    },
    refreshPage() {
      this.url = this.getUrlFromStorage();
      this.$refs.iframe.src = this.url;
    },
    dragStart(event) {
      // ... 省略之前的拖拽逻辑
    },
    drag(event) {
      // ... 省略之前的拖拽逻辑
    },
    dragEnd() {
      // ... 省略之前的拖拽逻辑
    },
    onIframeLoad() {
      // iframe 加载完成后，重置拖拽状态
      this.dragging = false;
    },
    saveUrlToStorage() {
      localStorage.setItem('previewUrl', this.url);
    },
    getUrlFromStorage() {
      return localStorage.getItem('previewUrl') || '';
    }
  },
  created() {
    this.url = this.getUrlFromStorage();
  }
};
</script>

<style scoped>
.web-previewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iframe-container {
  overflow: hidden;
  border: 1px solid #ccc;
  resize: both;
  width: 600px; /* Default width */
  height: 400px; /* Default height */
  position: relative;
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
}
</style>
