/**
 * copy text when user click.
 * this function can only be used based on the vue.
 */

import { ElMessage } from "element-plus";

export function clickCopy(
  el: MouseEvent,
  cb: Function | null,
  str?: string
): void {
  if (!str)
    str = (el.currentTarget as any).innerText

  const textarea: any = document.createElement('textarea')
    ; (el.currentTarget as any).appendChild(textarea)
  textarea.value = str
  textarea.select()
  document.execCommand('copy')
  textarea.remove()

  if (cb)
    cb()
  else
    ElMessage({
      message: '复制成功！',
      type: 'success'
    })
}