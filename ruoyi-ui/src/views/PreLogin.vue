<template>
  <div>
    <div id="app" class="app-container">
      <TodoRecorder></TodoRecorder>
    </div>
    <div class="pre-login-container">
      <h1>欢迎来到mx前台页面</h1>
      <button @click="goToLogin">前往mx后台页面</button>
    </div>
  </div>
</template>
<script>
import TodoRecorder from './TodoRecorder.vue';

export default {
  components: {
    TodoRecorder
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
/* 待办事项记录器容器的样式 */
.app-container {
  margin-bottom: 200px; /* 添加下边距 */
}

/* 预登录页面容器的样式 */
.pre-login-container {
  text-align: center;
  margin-top: 200px; /* 添加上边距 */
}

.pre-login-container h1 {
  margin-bottom: 20px;
}
</style>
