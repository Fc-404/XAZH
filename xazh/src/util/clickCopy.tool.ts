/**
 * copy text when user click.
 * this function can only be used based on the vue.
 */

import { message } from 'ant-design-vue'

export async function clickCopy(
  el: MouseEvent,
  done: Function | string | null,
  str?: string
) {
  if (!str)
    str = (el.currentTarget as any).innerText

  try {
    await navigator.clipboard.writeText(str as string)

    if (typeof done == 'function')
      (done as Function)()
    else
      message.success(done || '复制成功！')
  } catch {
    message.error('复制失败！')
  }

}