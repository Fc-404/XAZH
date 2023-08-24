/**
 * It is email templete and be sended by we.
 */

import { formatDate } from "../util/formatDate.util"

export default function (code: string) {
  const date = formatDate(true, true)
  return `
  <div style="
  font-size: 16px;
  max-width: 44rem;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
  color: #5e5e5edd;
  ">
  <h2 style="color: #2255ff; text-align: center;">夏至De主页</h2><hr style="border-color: #2255ff22; margin-bottom: 2rem;">
  <p style="text-indent: 2rem;">您好！欢迎注册本站账号。</p>
  <p style="text-indent: 2rem;">您的验证码是<b style="margin: auto 1rem; color: #6611cc;">${code}</b>，有效时间5分钟！</p>
  <p style="text-indent: 2rem;">如果您没有进行注册，请忽略此邮件。</p>
  <p style="text-indent: 2rem;">请不要分享此信息！</p><hr style="border-color: #2255ff22; margin: 2rem auto;">
  <p style="text-align: right;">${date}</p>
  </div>
  `
}