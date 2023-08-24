/**
 * Format Date
 */

export function formatDate(chinese: boolean = false, second: boolean = false): string {
  const d = new Date()
  return d.getFullYear()
    + (chinese ? '年' : '-')
    + (d.getMonth() + 1)
    + (chinese ? '月' : '-')
    + d.getDate()
    + (chinese ? '日 ' : ' ')
    + d.getHours()
    + (chinese ? '时' : ':')
    + d.getMinutes()
    + (chinese ? '分' : '')
    + (second
      ? (chinese ? '' : ':')
      + d.getSeconds()
      + (chinese ? '秒' : '')
      : '')
}