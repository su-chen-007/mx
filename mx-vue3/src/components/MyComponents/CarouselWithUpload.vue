<template>
  <div class="carousel-container" :key="componentKey">
    <!-- 上传图片按钮 -->
    <button @click="triggerFileInput" class="upload-button">上传图片</button>
    <button @click="clearImages" class="clean-button">一键清空</button>
    <!-- 轮播图容器 -->
    <div class="carousel">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(image, index) in images" :key="index" class="carousel-item">
          <img :src="image" alt="Carousel Image" class="carousel-image" />
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button @click="prevSlide" class="prev-button">‹</button>
    <button @click="nextSlide" class="next-button">›</button>

    <!-- 隐藏的文件输入框 -->
    <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileChange" style="display: none;" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, onUpdated, nextTick } from 'vue';
defineOptions({
  name: "MyComponentCarouselWithUpload",
});
// 图片列表
const images = ref([]);

// 当前显示的图片索引
const currentIndex = ref(0);

// 文件输入框的引用
const fileInput = ref(null);

// 组件的 key，用于强制重新渲染
const componentKey = ref(0);

// 自动滚动的定时器 ID
let autoScrollInterval = null;

// 页面加载时从 localStorage 获取图片
onMounted(() => {
  const storedImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');
  images.value = storedImages;
});

// 启动自动滚动
const startAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
  autoScrollInterval = setInterval(() => {
    nextSlide();
  }, 3000); // 每 3 秒自动切换一张图片
};

// 清除自动滚动定时器
const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
};

// 触发文件输入框
const triggerFileInput = () => {
  fileInput.value.click();
};

// 清空图片
const clearImages = () => {
  images.value = [];
  localStorage.setItem('carouselImages', JSON.stringify([]));
  currentIndex.value = 0;
  componentKey.value++; // 强制更新组件
};

// 处理文件上传
const handleFileChange = (event) => {
  const files = event.target.files;
  const newImages = Array.from(files).map(file => URL.createObjectURL(file));

  // 将新图片加入到图片列表
  images.value = newImages;

  // 更新 localStorage
  localStorage.setItem('carouselImages', JSON.stringify(images.value));
};

// 在组件数据更新且渲染完成后，检查并启动自动滚动等功能
onUpdated(() => {
  if (images.value.length > 0 &&!autoScrollInterval) {
    startAutoScroll();
  }
});

// 上一张
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};

// 下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

// 在组件销毁前清除自动滚动定时器
onBeforeUnmount(() => {
  stopAutoScroll();
});
</script>

<style scoped>
.carousel-container {
  width: 600px;  /* 设置固定宽度 */
  height: 300px; /* 设置固定高度 */
  overflow: hidden; /* 超出容器外的部分隐藏 */
  position: relative;
  margin: 0 auto; /* 居中显示 */
  border: 2px solid #ddd; /* 可选：给轮播容器加个边框 */
  border-radius: 10px;
}

.upload-button {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
}

.clean-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: fill; /* 或者 contain，根据需求 */
}

.prev-button,.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  z-index: 10;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}
</style>