<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="resetPwdPage">
import { updateUserPwd } from "@/api/system/user";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import tagsStore from "@/stores/tagsView";
import type { FormRule } from "@form-create/element-ui";
import type { ElForm } from "@/api/form";

// const { proxy } = getCurrentInstance();
const tStore = tagsStore();
const pwdRef = ref<ElForm>();
const user = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const equalToPassword = (rule: FormRule, value: string, callback: (error?: Error) => void) => {
  if (user.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rules = ref({
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
});

/** 提交按钮 */
function submit() {
  pwdRef.value?.validate((valid) => {
    if (valid) {
      updateUserPwd(user.oldPassword, user.newPassword).then(() => {
        ElMessage.success("修改成功");
      });
    }
  });
}
/** 关闭按钮 */
function close() {
  tStore.closePage();
}
</script>
