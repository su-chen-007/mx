<!--<script setup lang="ts">-->
<!--defineExpose({-->
<!--  name: "MyRelationship",-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <div></div>-->
<!--</template>-->

<!--<style scoped lang="less"></style>-->

<template>
  <div class="calculator">
    <div class="header">{{ headerTitle }}</div>
    <div class="info">
      <!--用户输出结果-->
      <div class="out">
        <span>{{ outPutShow }}</span>
      </div>
      <div class="tips">为</div>
      <!--用户输入内容-->
      <div class="input">
        <span>{{ userInputShow }}</span>
      </div>
    </div>
    <div class="toggle">
      <span style="margin-right: 10px">我的性别</span>
      <el-switch v-model="sex" :active-value="Sex.male" :inactive-value="Sex.female" size="small" active-text="男" inactive-text="女" />
    </div>
    <div class="buttons">
      <div class="col">
        <button @click="handleBtnClick('爸爸')">父</button>
        <button @click="handleBtnClick('哥哥')">兄</button>
        <button @click="handleBtnClick('弟弟')">弟</button>
        <button @click="handleBtnClick('儿子')">子</button>
      </div>
      <div class="col">
        <button @click="handleBtnClick('妈妈')">母</button>
        <button @click="handleBtnClick('姐姐')">姐</button>
        <button @click="handleBtnClick('妹妹')">妹</button>
        <button @click="handleBtnClick('女儿')">女</button>
      </div>
      <div class="col">
        <button @click="handleBtnBack">←</button>
        <!--<button :style="sex === Sex.female ? { color: '' } : { color: '#717171' }" @click="sex === Sex.female ? handleBtnClick('老公') : null">夫</button>-->
        <button @click="handleBtnClick('老公')">夫</button>
        <button @click="handleSwitchHeader" :class="isReverse ? 'switch' : ''">⇌</button>
        <button @click="handleGoToBaidu">?</button>
      </div>
      <div class="col">
        <button @click="handleReset">↻</button>
        <!--<button :style="sex === Sex.male ? { color: '' } : { color: '#717171' }" @click="sex === Sex.male ? handleBtnClick('老婆') : null">妻</button>-->
        <button @click="handleBtnClick('老婆')">妻</button>
        <button @click="handleResult" class="equal">=</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { cloneDeep } from "es-toolkit";
//@ts-ignore
import relationship from "relationship.js";
import { Sex } from "./methods";
defineOptions({
  name: "MyRelationship",
});
const sex = ref<Sex>(Sex.male); //本人性别：0表示女性,1表示男性
const isReverse = ref<boolean>(false); //是否交换称呼,false 是我称呼他,true 他称呼我
const userInput = ref<string[]>([]); //用户输入的(或者为计算结果)
const outPut = ref<string[]>([]); //历史记录
const headerTitle = computed(() => {
  return isReverse.value ? "Ta称呼我" : "我称呼Ta";
});
const userInputShow = computed(() => {
  return userInput.value.join("的");
});
const outPutShow = computed(() => {
  return outPut.value.join("的");
});
///关系按钮点击
const handleBtnClick = (call: string) => {
  userInput.value.push(call);
};
//交换结果
const switchResult = (result: string[]) => {
  const temp = cloneDeep(userInput.value);
  userInput.value = result;
  outPut.value = temp;
};
//上一步
const handleBtnBack = () => {
  userInput.value.pop();
};
//重置
const handleReset = () => {
  userInput.value = [];
  outPut.value = [];
};

//结果
const handleResult = () => {
  let result = relationship({
    text: userInput.value.join("的"),
    sex: sex.value,
    reverse: isReverse.value,
  });
  console.log("result", result);
  switchResult(result);
};
//切换称呼结果
const handleSwitchHeader = () => {
  isReverse.value = !isReverse.value;
  //如果有结果,则再次计算一次
  userInput.value = cloneDeep(outPut.value);
  handleResult();
};
//跳转百度
const handleGoToBaidu = () => {
  window.open(`https://www.baidu.com`);
};
</script>

<style scoped lang="less">
.calculator {
  background-color: #2c2c2c;
  color: #fff;
  width: 400px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px;
  //头部
  .header {
    font-size: 12px;
    color: #bbb;
  }
  //内容区
  .info {
    height: 120px;
    font-size: 14px;
    text-align: right;
    display: flex;
    flex-direction: column;
    .out {
      box-sizing: border-box;
      height: 30%;
      padding: 10px 0;
      //超出2行省略
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      //border: 1px solid red;
    }
    .tips {
      color: #bbb;
      font-weight: bold;
    }
    .input {
      //border: 1px solid blue;
      box-sizing: border-box;
      padding: 10px 0;
      height: 0;
      flex: 1;
      //height: 70%;
      font-size: 16px;
      //超出2行省略
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .toggle {
    font-size: 12px;
    display: flex;
    align-items: center;
  }
  .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    .col {
      display: flex;
      flex-direction: column;
    }
    button {
      background-color: #444;
      color: white;
      padding: 10px 4px;
      border: 1px solid #868686;
      //border-right: none;
      border-radius: 0;
      width: 100%;
      &.switch {
        background-color: darken(#444, 10%);
      }
      &:active {
        transform: scale(1.05);
      }
      &.equal {
        flex: 1;
        background-color: #e7763e;
      }
    }
  }
}
</style>
