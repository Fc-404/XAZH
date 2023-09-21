/**
 * Handle error for axios
 * @param error 
 */
import { message } from "ant-design-vue"

export function AxiosErrorCatch(error: any) {
  const response = error.response
  if (response) {
    // Receive the response
    const status = response.status
    switch (status) {
      case 403:
        message.warn('请求被拒绝！')
        break
      case 404:
        message.error('资源未找到！')
        break
      case 433:
        message.warn('请求参数错误！')
        break
      default:
        message.warn('未知错误！')
    }
  } else {
    // No response received
    message.error('服务器未响应！')
  }
}