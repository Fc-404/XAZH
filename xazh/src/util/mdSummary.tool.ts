export default function MDSummary(mdString: string, length: number = 256): string {
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