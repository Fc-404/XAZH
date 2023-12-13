/**
 * Parse require head, and get the data of file
 */

const split = function (data: Buffer, separator: string, first: boolean): Array<Buffer> {
  const dataArr = []
  let offset = 0
  let index = data.indexOf(separator, 0)
  let i = 0
  while (index != -1 && (!first || ++i <= 2)) {
    dataArr.push(data.slice(offset, index))
    offset = index + separator.length
    index = data.indexOf(separator, index + separator.length)
  } 
  dataArr.push(data.slice(offset))

  return dataArr
}

export default function parseFormData(data: Buffer, boundary: string, first: boolean = false): Array<{
  'form-data': string,
  name: string,
  filename: string,
  body: Buffer
}> {
  if (!data.length)
    return []

  const datas = split(data, boundary, first).slice(1, -1)

  const result = []

  for (let i of datas) {
    let object = {}
    const [head, body] = split(i, '\r\n\r\n', false)
    const headArr = split(head, '\r\n', false).slice(1)
    const [, hv] = headArr[0].toString().split(': ')

    hv.split('; ').forEach(item => {
      const [hvk, hvv = ''] = item.split('=')
      object[hvk] = hvv.toString()
    })
    object['body'] = body
    // remove character "
    object['filename'] = object['filename']?.slice(1, -1)

    result.push(object)
  }

  return result
  // [
  //   {
  //     form-data: *,
  //     name: *,
  //     filename: *,
  //     body: *,
  //   }
  // ]
}