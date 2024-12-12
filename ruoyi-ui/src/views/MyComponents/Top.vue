<template>
  <div class="ranking-list">
    <button @click="toggleDropdown">选择榜单</button>
    <div v-if="showDropdown" class="dropdown">
      <ul>
        <li @click="selectRanking('weibo')">微博榜单</li>
        <li @click="selectRanking('douyin')">抖音榜单</li>
        <li @click="selectRanking('自定义')">自定义榜单</li>
        <!-- 其他榜单选项 -->
      </ul>
    </div>
    <div class="ranking-content">
      <div v-for="(item, index) in rankings" :key="index" class="ranking-item">
        <div class="ranking-number">{{ index + 1 }}</div>
        <a :href="item.url" target="_blank" class="ranking-info">{{ item.word }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false,
      rankings: [],
      currentRanking: 'weibo',
      weiboApiUrl: 'https://proxy.cors.sh/https://zj.v.api.aa1.cn/api/weibo-rs?ranking=${ranking}', // 微博热搜API URL
      douyinApiUrl: 'https://proxy.cors.sh/https://v.api.aa1.cn/api/douyin-hot/index.php', // 抖音热榜API URL
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectRanking(ranking) {
      this.currentRanking = ranking;
      this.showDropdown = false;
      if (ranking === 'weibo') {
        this.fetchWeiboRankings(ranking);
      } else if (ranking === 'douyin') {
        this.fetchDouyinRankings();
      }
      // 其他榜单的请求逻辑...
    },
    fetchWeiboRankings(ranking) {
      this.currentRanking = ranking;
      this.showDropdown = false;
      const apiUrl = `https://zj.v.api.aa1.cn/api/weibo-rs?ranking=${ranking}`;
      const proxyUrl = `https://proxy.cors.sh/${apiUrl}`;
      fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
          if (data.code === 1) {
            this.rankings = data.data.map(item => ({
              word: item.title,
              url: item.url
            }));
          } else {
            console.error('Failed to fetch Weibo rankings:', data.message);
          }
        })
        .catch(error => console.error('Error fetching data:', error));
    },
    fetchDouyinRankings() {
      fetch(this.douyinApiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // 获取响应的HTML文本
        })
        .then(text => {
          console.log("1"+text);

          const jsonRegex = /<script[^>]*>(.*?)<\/script>.*?<script[^>]*>(.*?)<\/script>.*?(\{.*\})/s;
          const match = text.match(jsonRegex);
          // 尝试解析JSON
          const data = JSON.parse(match[3]);
          console.log("3"+data.data.word_list);
          this.rankings = data.data.word_list.map(item => ({
            word: item.word,
            url: "https://www.douyin.com/root/search/"+item.word
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }
};
</script>

<style scoped>
.ranking-list {
  background-color: #2fc7b5;
  width: 350px; /* 增加宽度 */
  height: 400px; /* 增加高度 */
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
}

.dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  width: 60%;
  box-sizing: border-box;
  z-index: 10;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  width: 50%;
  margin: 0;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}

.ranking-content {
  margin-top: 40px;
}

.ranking-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.ranking-number {
  width: 50px; /* 固定编号宽度 */
  font-weight: bold;
}

.ranking-info {
  flex-grow: 1;
  white-space: nowrap; /* 不允许文字跨行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  font-size: 14px; /* 减小字体大小 */
}

.ranking-link {
  font-size: 14px; /* 减小字体大小 */
  color: #007bff; /* 链接颜色 */
  text-decoration: none; /* 去掉下划线 */
}

.ranking-link:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}
</style>
