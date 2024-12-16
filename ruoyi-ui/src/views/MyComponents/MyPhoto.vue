<template>
  <div class="photo-album">
    <div class="upload-section">
      <input type="file" multiple @change="handleFileChange" accept="image/*" />
      <button @click="triggerFileInput">上传图片</button>
    </div>
    <div class="carousel">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="carousel-item" v-for="(image, index) in images" :key="index">
          <img :src="image" alt="Album Image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      currentIndex: 0,
      interval: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      const promises = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e.target.error);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises)
        .then((urls) => {
          this.images = [...this.images, ...urls];
          this.startCarousel();
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });

      event.target.value = ''; // Clear the file input
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    startCarousel() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 3000); // Change image every 3 seconds
    },
    stopCarousel() {
      if (this.interval) clearInterval(this.interval);
    },
  },
  beforeDestroy() {
    this.stopCarousel();
  },
};
</script>

<style scoped>
.photo-album {
  text-align: center;
}

.upload-section {
  margin-bottom: 20px;
}

.carousel {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  border: 2px solid #ddd;
  position: relative;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-item img {
  width: 100%;
  display: block;
}
</style>
