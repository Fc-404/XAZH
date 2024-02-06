/**
 * Encode message.
 */
type resultType = {
  date: Date,
  data: string,
}

export function base64WithDate(
  msg: string,
  date?: Date
): resultType {
  const date_ = date ? new Date(date) : new Date()
  const dateSeed = date_.getTime().toString().slice(0, -3)
  const base64Count: number =
    parseInt(dateSeed.slice(-1))
    || 9
  var msgN = msg
  for (let i = 0; i < base64Count; ++i) {
    msgN = btoa(msgN)
    let index =
      parseInt(dateSeed.slice(-(i + 1), i ? -i : undefined))
      % msgN.length
    msgN = msgN.slice(index) + msgN.slice(0, index)
  }

  return {
    date: date_,
    data: msgN
  }
}

export function debase64WithDate(
  obj: {
    date: string,
    data: string
  }
): string | boolean {
  try {
    const date = new Date(obj.date)
    const dateSeed = date.getTime().toString().slice(0, -3)
    if (dateSeed == 'NaN')
      return false

    const base64Count: number =
      parseInt(dateSeed.slice(-1))
      || 9
    var result = obj.data
    for (let i = 0; i < base64Count; ++i) {
      let index = parseInt(dateSeed.slice(
        -(base64Count - i),
        -(base64Count - i - 1) || undefined
      )) % result?.length
      result =
        result.slice(result.length - index)
        + result.slice(0, result.length - index)
      result = atob(result)
    }

    return result
  } catch {
    return false
  }
}