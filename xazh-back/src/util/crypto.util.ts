import * as crypto from 'crypto'

export function md5(body: crypto.BinaryLike) {
  return crypto.createHash('md5').update(body).digest('hex')
}

export function sha1(body: crypto.BinaryLike) {
  return crypto.createHash('sha1').update(body).digest('hex')
}

export const base64 = {
  encode: (v) => {
    return Buffer.from(v).toString('base64')
  },
  decode: (v) => {
    return Buffer.from(v, 'base64').toString()
  }
}