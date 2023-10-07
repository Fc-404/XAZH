<template>
  <div id="editp">
    <div id="editp-head">
      <a-button type="text">
        <LeftOutlined style="margin-left: -6px;" />
        返回
      </a-button>
      <div style="width: 1rem;"></div>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <a-input
        placeholder="标题"
        :bordered="false"
        :maxlength="64"
        show-count
      ></a-input>
      <a-divider
        type="vertical"
        style="height: 100%;"
      ></a-divider>
      <div style="width: 1.8rem;"></div>
      <a-button type="primary">发布</a-button>
    </div>
    <div id="editp-">
      <Editor></Editor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined } from '@ant-design/icons-vue';
</script>

<style scoped lang="less">
#editp {
  background: var(--colorBgLayout);

  &-head {
    height: 2rem;
    padding: .2rem 1.8rem .2rem .2rem;
    display: flex;

    .ant-input-affix-wrapper {
      font-size: 1.1rem;
    }
  }

  &- {
    height: calc(100vh - 2.4rem);
  }
}
</style>