/**
 * The name corresponding to the user level.
 */
export function getUserLevelName(index: number) {
  const names = [
    '访客',
    '用户',
    '管理员',
    '站长'
  ]

  return names[index] ?? names[0]
}

export function getUserLevelTagColor(index: number) {
  const colors = [
    '',
    'cyan',
    'blue',
    '#faad14'
  ]

  return colors[index] ?? colors[0]
}
