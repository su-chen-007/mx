<template>
  <div class="window-component">
    <div v-for="(row, index) in options" :key="index" class="option-row">
      <span class="fixed-word">{{ row.fixed }}</span>
      <span
          v-for="option in row.options"
          :key="option"
          :class="{ selected: isSelected(index, option) }"
          @click="selectOption(index, option)"
      >{{ option }}</span>
    </div>
    <button class="button-word" @click="sendPostRequest">生成设计图</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineOptions({
  name: "AiWindowComponent",
});

const options = ref([
  { fixed: "风格", options: ['休闲风', '复古风', '简约风', '欧美风', '日系风'] },
  { fixed: "材质", options: ['棉质', '麻质', '丝绸', '皮革', '聚酯纤维'] },
  { fixed: "色度", options: ['亮色', '暗色', '中性色', '彩色', '素色'] },
  { fixed: "场合", options: ['职场', '休闲', '运动', '晚宴', '旅行'] },
  { fixed: "季节", options: ['春季', '夏季', '秋季', '冬季', '混合'] },
  { fixed: "图案", options: ['纯色', '条纹', '格子', '碎花', '动物纹'] },
  { fixed: "领型", options: ['圆领', '尖领', '方领', 'V 领', '高领'] },
  { fixed: "袖型", options: ['长袖', '短袖', '无袖', '七分袖', '泡泡袖'] },
  { fixed: "装饰", options: ['绣花', '铆钉', '亮片', '蝴蝶结', '流苏'] }
]);

const selectedOptions = ref([]);
const showRankings = ref(false);

const isSelected = (rowIndex, option) => {
  return selectedOptions.value.some(selected => selected.rowIndex === rowIndex && selected.option === option);
};

const selectOption = (rowIndex, option) => {
  const existingIndex = selectedOptions.value.findIndex(selected => selected.rowIndex === rowIndex && selected.option === option);
  if (existingIndex > -1) {
    selectedOptions.value.splice(existingIndex, 1);
  } else {
    selectedOptions.value.push({ rowIndex, option });
  }
};

const generateInputStatement = () => {
  let inputStatement = "帮我生成一个";
  selectedOptions.value.forEach(selected => {
    const { rowIndex, option } = selected;
    const fixedWord = options.value[rowIndex].fixed;
    inputStatement += `${fixedWord}为${option} `;
  });
  inputStatement += "的服装设计图";
  return inputStatement;
};

const sendPostRequest = async () => {
  const inputStatement = generateInputStatement();
  console.log(inputStatement);

  const apiUrl = 'https://visual.volcengineapi.com/?Action=HighAesGeneralV21L&Version=2024-06-06';
  const proxyUrl = `https://proxy.cors.sh/${encodeURIComponent(apiUrl)}`; // 使用encodeURIComponent确保URL编码正确

  const method = 'POST';
  const headers = {
    'Authorization': 'HMAC-SHA256 Credential=AKLTYzhkY2Y0OTI3ZWQzNGM3NWIxMGE5ODVmMjczZmViZmQ/20241226/cn-beijing/cv/request, SignedHeaders=host;x-content-sha256;x-date, Signature=926570b403f6e94c0ebee321c3bcf5b9317058278b31237b9b5e20c7ac6b7270',
    'Content-Type': 'application/json',
    'Host': 'visual.volcengineapi.com',
    'X-Content-Sha256': '7e063a3543aa06a91dc1aedd9d9078fe8c528456e7fc169a219ad980f4140279',
    'X-Date': '20241226T074212Z'
  };
  const body = JSON.stringify({
    prompt: inputStatement,
    req_key: "high_aes_general_v21_L"
  });

  try {
    const response = await fetch(proxyUrl, { method, headers, body });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response data:', data);
    // 处理响应数据
  } catch (error) {
    console.error('Error sending POST request:', error);
  }
};

</script>

<style scoped>
.window-component {
  width: 450px;
  height: 460px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.button-word {
  padding: 10px;
  border: 1px solid #11268d;
  border-radius: 5px;
  background-color: #dee1e8;
  margin: 10px 10px;
}

.option-row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.fixed-word {
  margin-right: 10px;
  font-weight: bold;
}

span {
  margin-right: 10px;
  cursor: pointer;
  background-color: lightgray;
  padding: 3px 6px;
  border-radius: 3px;
}

span.selected {
  background-color: green;
  color: white;
}
</style>