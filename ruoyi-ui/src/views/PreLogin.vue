<template>
  <div>
    <div >
      <h1>时间组件</h1>
      <MyDate></MyDate>
    </div>
    <div class="pre-login-container">
      <h1>欢迎来到mx前台页面</h1>
      <button @click="goToLogin">前往mx后台页面</button>
    </div>
    <div class="pre-login-container">
      <TodoRecorder></TodoRecorder>
    </div>
    <div class="pre-login-container">
      <web-previewer></web-previewer>
    </div>
  </div>
</template>
<script>
import TodoRecorder from './TodoRecorder.vue';
import MyDate from './MyDate.vue';

export default {
  components: {
    TodoRecorder,
    MyDate
  },
  name: 'PreLogin',
  methods: {
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>
<style>

/* 页面容器的样式 */
.pre-login-container {
  text-align: center;
  margin-top: 300px; /* 添加上边距 */
  margin-bottom: 50px;
}

</style>
