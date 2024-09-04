<template>
  <div id="edituserinfo">
    <table>
      <tbody>
        <tr>
          <td colspan="2">
            <a-divider orientation="left" class="eui-title">基本信息</a-divider>
          </td>
        </tr>

        <tr>
          <td>头像</td>
          <td>
            <UploadPic></UploadPic>
          </td>
        </tr>
        <tr>
          <td>用户唯一ID</td>
          <td>{{ props.userInfo._id }}</td>
        </tr>
        <tr>
          <td>注册时间</td>
          <td>{{ props.userInfo.signup_date }}</td>
        </tr>
        <tr>
          <td>用户名</td>
          <td>{{ props.userInfo.user }}</td>
        </tr>
        <tr>
          <td>个人简介</td>
          <td>
            <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }">
              {{ props.userInfo.about_me }}
            </a-textarea>
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <a-divider orientation="left" class="eui-title">额外信息</a-divider>
          </td>
        </tr>
        <tr>
          <td>隐私信息权限</td>
          <td>公开</td>
        </tr>
        <tr>
          <td>姓名</td>
          <td>xazh</td>
        </tr>
        <tr>
          <td>年龄</td>
          <td>18</td>
        </tr>
        <tr>
          <td>性别</td>
          <td>男</td>
        </tr>
        <tr>
          <td>地址</td>
          <td>中国</td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td>
            <p>QQ</p>
            <p>WeChat</p>
            <p>Email</p>
            <p>Phone</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import UploadPic from '../../components/upload/UploadPic.vue'

const props = defineProps({
  userInfo: { type: Object, default: {} },
})
const emit = defineEmits(['update:userInfo'])
</script>

<style scoped lang="less">
#edituserinfo {
  table {
    margin: auto;
    margin-bottom: 20rem;
    min-width: 40rem;

    > tbody {
      .eui-title {
        color: var(--colorTextTertiary);
        font-size: 1.5rem;
      }

      > tr td:nth-child(1) {
        padding: 1rem 2rem;
        text-align: right;
        color: var(--colorText);
        vertical-align: top;
      }
      > tr td:nth-child(2) {
        padding: 1rem 2rem;
      }
    }
  }
}
</style>
