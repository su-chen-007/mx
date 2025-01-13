<template>
  <div class="bookmark-container">
    <div class="header">网址收藏夹</div>
    <div class="bookmarks">
      <div class="bookmark" @click="handleRouteToUrl($event,bookmark.url)" v-for="(bookmark, index) in bookmarks" :key="index" :style="{ backgroundImage:  `url(${handleImageBackGround(bookmark.url)})`,  backgroundRepeat: 'no-repeat',  backgroundPosition: 'center', backgroundSize: 'cover'}">
        <div class="delete-btn" @click="removeBookmark(index)">-</div>
        <span v-if="!bookmark.isEditing" @click.stop="handleEdit(index)" class="bookmark-name">{{ bookmark.name }}</span>
        <input
          v-else
          v-model="bookmark.name"
          class="bookmark-name"
          @blur="exitEditMode(index)"
          @keyup.enter="exitEditMode(index)"
          autofocus
        />
      </div>
      <button class="add-btn" @click="showAddBookmarkModal = true">+</button>
    </div>
    <div class="add-modal" v-if="showAddBookmarkModal">
      <div class="form">
        <input v-model="newBookmark.name" placeholder="网址名称"/>
        <input v-model="newBookmark.url" placeholder="网址"/>
      </div>
      <div class="form-btn">
        <button @click="addBookmark" class="form-add-btn">添加</button>
        <button @click="showAddBookmarkModal = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyComponentWww",
  data() {
    return {
      bookmarks: [],
      newBookmark: { name: '', url: '', color: '#FFD700', isEditing: false }, // 默认颜色
      showAddBookmarkModal: false,
    };
  },
  methods: {
    addBookmark() {
      if (this.newBookmark.url.trim() !== '') {
        this.bookmarks.push({ ...this.newBookmark });
        this.newBookmark = { name: '', url: '', color: '#FFD700', isEditing: false };
        this.showAddBookmarkModal = false;
      }
    },
    removeBookmark(index) {
      this.bookmarks.splice(index, 1);
    },
    // 点击跳转
    handleRouteToUrl(e, url) {
      if (e.target !== e.currentTarget) {
        return
      }
      window.open(`https://${url}`, '_blank');
    },
    // 点击修改
    handleEdit(index) {
      this.bookmarks[index].isEditing = true;
      this.bookmarks = this.bookmarks.map((item, i) => {
        if (index !== i) {
          return { ...item, isEditing: false };
        }
        return { ...item, isEditing: true };
      })
    },
    // 修改后失焦
    exitEditMode(index) {
      this.bookmarks = this.bookmarks.map((item, i) => {
        return { ...item, isEditing: false };
      })
    },
    // 设置图片背景
    handleImageBackGround(url) {
      return `https://${url}/favicon.ico`
    },
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
  padding-bottom: 10px;
}

.bookmarks {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin: -10px;
  max-width: 100%;
}

.bookmark {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  width: 100px;
  height: 100px;
  transition: transform 0.3s ease;
  border-radius:  50%;
  position: relative;
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
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate(-50%, 0)
}

.delete-btn {
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border: 1px solid red;
  border-radius: 50%;
  color: red;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}


.add-btn {
  width: 80px;
  height: 80px;
  margin-left: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
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

.form{
  display: flex;
  flex-direction: column;
}

.form-btn{
  display: flex;
  justify-content: center;
}

.form-add-btn {
  margin-right: 10px;
}
</style>
