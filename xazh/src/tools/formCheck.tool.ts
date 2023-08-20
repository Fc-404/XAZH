/**
 * For verify form value.
 */

const userLen = [1, 16]
const pswdLen = [6, 16]


// If return -1, it means too short with the string.
// If return 1, it means too long with the string.
// If return 0, it means that the string is suitable.
export function checkUserLen(str: string): number {
  return str.length < userLen[0] ? -1 :
    (str.length > userLen[1] ? 1 : 0)
}
export function checkPswdLen(str: string): number {
  return str.length < pswdLen[0] ? -1 :
    (str.length > pswdLen[1] ? 1 : 0)
}


// Automatic format value.
export function formatUser(str: string): string {
  let len: number = 0
  let result: string = ''
  for (let i of str) {
    if (/[\u4e00-\u9fa5]/.test(i)) {
      if (len + 2 > userLen[1])
        break
      result += i
      len += 2
    } else if (/[A-Za-z0-9@-_]/.test(i)) {
      if (len + 1 > userLen[1])
        break
      result += i
      len++
    }
  }

  return result
}
export function formatPswd(str: string): string {
  let len: number = 0
  let result: string = ''
  for (let i of str) {
    if (len >= pswdLen[1])
      break
    let code = i.charCodeAt(0)
    if (code >= 33 && code <= 125) {
      len++
      result += i
    }
  }

  return result
}

// Check mail address
export function checkMail(str: string): boolean {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
}