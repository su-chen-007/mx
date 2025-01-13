<template>
  <div class="search-container" :style="{ width: '600px', height: '300px', backgroundColor: 'rgba(0, 0, 0, 0.5)', backgroundImage: 'url(' + backgroundImageUrl + ')' }">
    <div class="upload-button">
      <button @click="triggerClick">上传背景图片</button>
    </div>
    <input type="text" class="declaration-input" placeholder=" 你好 AI+未来 " disabled />
    <div class="search-box">
      <input type="text" v-model="searchQuery" class="search-input" placeholder="请输入搜索内容" />
      <button @click="performSearch" class="search-button">搜索</button>
    </div>
    <div class="engine-selector">
      <label v-for="(engine, index) in searchEngines" :key="index">
        <input type="radio" :value="engine" v-model="selectedEngine" />
        {{ engine }}
      </label>
    </div>
    <input type="file" @change="handleImageUpload" ref="fileInput" style="display: none;" />
  </div>
</template>

<script>
import backgroundImage from '@/assets/images/mycomponent/bj.png';
export default {
  name:"MyComponentSearch",
  data() {
    return {
      searchQuery: '',
      selectedEngine: '百度',
      searchEngines: ['百度', '抖音', '微博', 'Bing'],
      backgroundImageUrl: backgroundImage, // 用于存储用户上传的图片 URL
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.backgroundImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    triggerClick() {
      this.$refs.fileInput.click(); // 触发文件输入的点击事件
    },
    performSearch() {
      if (this.searchQuery) {
        let searchUrl = '';
        switch (this.selectedEngine) {
          case '百度':
            searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(this.searchQuery)}`;
            break;
          case '抖音':
            searchUrl = `https://www.douyin.com/root/search/${encodeURIComponent(this.searchQuery)}`;
            break;
          case '微博':
            searchUrl = `https://m.weibo.cn/search?containerid=100103type=1&q=${encodeURIComponent(this.searchQuery)}`;
            break;
          case 'Bing':
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(this.searchQuery)}`;
            break;
        }
        window.open(searchUrl, '_blank');
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.upload-button {
  position: absolute;
  top: 10px;
  left: 15%;
  transform: translateX(-50%);
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  z-index: 1;
}
.declaration-input {
  width: 80%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 60px 0 20px; /* Adjusted margin to place it below the upload button */
  text-align: center;
  color: #333;
}
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
}
.search-input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
}
.search-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.engine-selector {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}
.engine-selector label {
  margin: 0 10px;
  font-size: 18px;
  color: white;
  cursor: pointer;
}
</style>
