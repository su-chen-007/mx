<template>
  <div class="bookmark-container">
    <div class="header">网址收藏夹一</div>
    <div class="bookmarks">
      <div class="bookmark" v-for="(bookmark, index) in bookmarks" :key="index" :style="{ backgroundColor: bookmark.color }">
        <a :href="bookmark.url" target="_blank">
          <div class="bookmark-name">{{ bookmark.name }}</div>
        </a>
        <button class="delete-btn" @click="removeBookmark(index)">X</button>
      </div>
      <button class="add-btn" @click="showAddBookmarkModal = true">+</button>
    </div>
    <div class="add-modal" v-if="showAddBookmarkModal">
      <input v-model="newBookmark.name" placeholder="网址名称" />
      <input v-model="newBookmark.url" placeholder="网址" @input="generateRandomColor" />
      <button @click="addBookmark">添加</button>
      <button @click="showAddBookmarkModal = false">取消</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookmarks: [],
      newBookmark: { name: '', url: '', color: '#FFD700' }, // 默认颜色
      showAddBookmarkModal: false
    };
  },
  methods: {
    addBookmark() {
      if (this.newBookmark.url.trim() !== '') {
        this.bookmarks.push({ ...this.newBookmark });
        this.newBookmark = { name: '', url: '', color: '#FFD700' };
        this.showAddBookmarkModal = false;
      }
    },
    removeBookmark(index) {
      this.bookmarks.splice(index, 1);
    },
    generateRandomColor() {
      // 生成一个随机的十六进制颜色值
      const randomColor = '#' + Math.floor(Math.random()*16777777).toString(16);
      this.newBookmark.color = randomColor;
    }
  }
};
</script>

<style scoped>
.bookmark-container {
  margin: 30px 10px 10px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  width: 300px;
  height: 400px;
  overflow-y: auto;
}

.header {
  font-size: 24px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.bookmarks {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -10px;
  max-width: 100%;
}

.bookmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.bookmark:hover {
  transform: scale(1.05); /* 鼠标悬停时放大 */
}

.bookmark img {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.bookmark-name {
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  margin: 10px 10px 10px 10px;
  background: #f00;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
  z-index: 10;
}

.add-btn {
  margin-left: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.add-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
