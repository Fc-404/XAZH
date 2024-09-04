/**
 * To Generate abstract of markdown text.
 * @param mdString
 * @param length
 * @returns
 */
export function MDSummary(mdString: string, length: number = 256): string {
  const mdLen = mdString.length

  let p = 0
  let result = ''
  const regMdExcluder = /^[#@`\s-]/
  const regMdIncluder =
    /[^\u4E00-\u9FA5A-Za-z0-9,.;'"?()!&，。；’‘“？（）！、\s]/g

  while (p < mdLen) {
    const i = mdString.indexOf('\n', p) + 1 || mdLen
    let sentence = mdString.slice(p, i)
    sentence = sentence.replace(' ', '')
    p = i
    if (result.length > length) {
      break
    } else if (regMdExcluder.test(sentence)) {
      continue
    } else {
      sentence = sentence.replace(regMdIncluder, '')
      sentence = sentence.replace(/\s+/g, ' ')
      result += sentence + ' '
    }
  }

  return result
}

/**
 * User's img text from user's name
 * @param user
 * @returns
 */
export function user2ImgText(user: string): string {
  return /[\u4e00-\u9fa5]/.test(user[0]) ? user[0] : user.substring(0, 2)
}
export function user2ImgColor(user: string): string {
  if (!user) return '#808080'
  const color = [
    'red',
    'blue',
    'cyan',
    'pink',
    'gold',
    'lime',
    'green',
    'purple',
    'orange',
    'yellow',
    'magenta',
    'volcano',
    'geekblue',
  ]
  return 'var(--' + color[user.charCodeAt(0) % color.length] + ')'
}

export function numberFormat(num: number, digit: number = 1): string {
  if (num < 10000) return num.toString()
  // if (num < 100000) return (num / 1000).toFixed(digit) + 'k'
  if (num < 100000000) return (num / 10000).toFixed(digit) + 'w'
  if (num < 10000000000) return (num / 1000000).toFixed(digit) + 'M'
  return '∞'
}
