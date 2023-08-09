<template>
  <div id="footer">
    <a-row
      id="footer-fn"
      justify="center"
    >
      <span>
        <a-tooltip
          :title="githubAdr"
          color="var(--colorPrimary)"
        >
          <a
            :href="githubAdr"
            target="_blank"
          >
            <github-outlined />
          </a>
        </a-tooltip>
      </span>
      <span>
        <a-divider type="vertical"></a-divider>
      </span>
      <span @click="clickCopy($event, '邮箱复制成功！', gmailAdr)">
        <a-tooltip
          :title="gmailAdr"
          color="var(--colorPrimary)"
        >
          <mail-outlined />
        </a-tooltip>
      </span>
      <span
        @click="switchToDesktop"
        v-show="store.getters['config/platform'] != 'Desktop'"
      >
        <a-divider type="vertical"></a-divider>
        <a-tooltip
          title="访问电脑端"
          color="var(--colorPrimary)"
        >
          <desktop-outlined />
        </a-tooltip>
      </span>
    </a-row>
    <a-row
      id="footer-copyright"
      justify="center"
    >
      <span>
        Copyright&nbsp;
        <copyright-outlined />
        &nbsp;夏至XAZH
      </span>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { clickCopy } from "../../tools/clickCopy.tool.ts";

import { CopyrightOutlined, GithubOutlined, MailOutlined, DesktopOutlined } from "@ant-design/icons-vue";

const store = useStore()

const githubAdr = 'https://github.com/Fc-404'
const gmailAdr = 'gjl245869@gmail.com'

const switchToDesktop = function (): void {
  store.commit('config/platform', 'Desktop')
}
</script>

<style scoped lang="less">
#footer {
  padding-top: 1rem;
  padding-bottom: 2rem;

  &-fn {
    font-size: 1.2rem;
    margin-bottom: 1rem;

    span {
      cursor: pointer;
      color: var(--colorPrimary);
    }
  }

  &-copyright {
    font-size: 0.8rem;
    color: var(--colorTextSecondary);
  }
}</style>