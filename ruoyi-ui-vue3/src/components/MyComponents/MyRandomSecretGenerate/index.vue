<script setup lang="tsx">
import { ref } from "vue";
import { SecretType } from "./methods";
import { PasswordsTypes } from "./types";
import { copyTxt } from "@/utils/txt";
import { AnyColumn } from "element-plus/es/components/table-v2/src/common";
defineOptions({
  name: "MyRandomSecretGenerate",
});
// 密码生成组件的设置
const SecretTypeEnum = {
  UpperLetter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LowerLetter: "abcdefghijklmnopqrstuvwxyz",
  Number: "0123456789",
  OtherSymbol: "~!@#$%^&*()-+_=,.",
};
//表格数据
const passwords = ref<PasswordsTypes[]>([]);
// 设置选中的选项
const checkList = ref<SecretType[]>([SecretType.UpperLetter, SecretType.LowerLetter, SecretType.Number]);
// 用户自定义的设置
const userSetting = ref({
  length: 8,
  num: 10,
  omitString: "", // 默认排除一些常见易混淆字符
});
const handleCopy = (rowData: PasswordsTypes) => {
  copyTxt(rowData.password);
};
const tableColumns = [
  {
    title: "序号",
    key: "index",
    dataKey: "index",
    width: 60,
  },
  {
    title: "密码",
    key: "password",
    dataKey: "password",
    flexGrow: 1,
  },
  {
    key: "operations",
    dataKey: "operations",
    title: "操作",
    cellRenderer: ({ rowData }) => (
      <div>
        <el-button size="small" onClick={() => handleCopy(rowData)}>
          复制
        </el-button>
      </div>
    ),
    width: 70,
  },
] as AnyColumn[];

// 生成密码的函数
const generatePassword = () => {
  const availableChars = getAvailableChars();
  const passwords: PasswordsTypes[] = [];

  // 生成指定个数的密码
  for (let i = 0; i < userSetting.value.num; i++) {
    let password = "";
    for (let j = 0; j < userSetting.value.length; j++) {
      const randomChar = availableChars.charAt(Math.floor(Math.random() * availableChars.length));
      password += randomChar;
    }
    passwords.push({
      index: i + 1,
      password,
    });
  }
  return passwords;
};

// 获取用户选中的字符集
const getAvailableChars = () => {
  let chars = "";
  if (checkList.value.includes(SecretType.UpperLetter)) {
    chars += SecretTypeEnum.UpperLetter;
  }
  if (checkList.value.includes(SecretType.LowerLetter)) {
    chars += SecretTypeEnum.LowerLetter;
  }
  if (checkList.value.includes(SecretType.Number)) {
    chars += SecretTypeEnum.Number;
  }
  if (checkList.value.includes(SecretType.OtherSymbol)) {
    chars += SecretTypeEnum.OtherSymbol;
  }

  // 排除易混淆字符
  if (userSetting.value.omitString) {
    const omitChars = userSetting.value.omitString.split("");
    chars = chars
      .split("")
      .filter((char) => !omitChars.includes(char))
      .join("");
  }

  return chars;
};
//添加排除字符
const handleAddOmitStr = () => {
  userSetting.value.omitString += "0OoIl1";
};
// 触发密码生成
const onGenerate = () => {
  passwords.value = generatePassword();
};
// 复制全部
const onCopyAll = () => {
  copyTxt(passwords.value.map((item) => item.password).join("\n"));
};
</script>

<template>
  <div class="randomSecretGenerate">
    <!-- 选择密码类型 -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="大写字母(A-Z)" :value="SecretType.UpperLetter" />
      <el-checkbox label="小写字母(a-z)" :value="SecretType.LowerLetter" />
      <el-checkbox label="数字(0-9)" :value="SecretType.Number" />
      <el-checkbox label="~!@#$%^&*()-+_=,." :value="SecretType.OtherSymbol" />
    </el-checkbox-group>
    <!-- 设置密码长度、个数和排除字符 -->
    <div class="py-2">
      <div class="item">
        <div class="item_title">密码长度</div>
        <el-input-number v-model="userSetting.length" :min="1" controls-position="right" style="width: 180px" />
      </div>

      <div class="item">
        <div class="item_title">密码个数</div>
        <el-input-number v-model="userSetting.num" :min="1" controls-position="right" style="width: 180px" />
      </div>

      <div class="item">
        <div class="item_title">排除字符</div>
        <el-input v-model="userSetting.omitString" style="width: 180px" placeholder="排除不容易被分辨的字符" />
      </div>
      <!-- 提示信息 -->
      <div class="item special" @click="handleAddOmitStr">常见易混淆字符：0与O与o,I与l与1 点击添加到排除字符</div>
      <div class="item">
        <el-button @click="onGenerate" type="success">生成密码</el-button>
        <el-button @click="onCopyAll">复制全部</el-button>
      </div>
    </div>
    <!-- 显示生成的密码 -->
    <div>
      <el-table-v2 :columns="tableColumns" :data="passwords" :width="580" :height="200" />
    </div>
  </div>
</template>

<style scoped lang="less">
.randomSecretGenerate {
  width: 600px;
  padding: 10px;
  background-color: white;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    &.special {
      font-size: 12px;
      color: #999;
      cursor: pointer;
    }
    &_title {
      border-radius: 4px 0 0 4px;
      height: 30px;
      line-height: 30px;
      background-color: #eeeeee;
      padding: 0 10px;
      color: #555;
    }
  }
}
</style>
