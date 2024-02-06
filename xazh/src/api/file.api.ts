import { xazhAxios } from "../axios/xazh.axios";
import { AxiosProgressEvent } from "axios";

import { Md5 } from "ts-md5";
/**
 * Upload file.
 * @param name filename
 * @param data filedata
 * @returns md5 | null
 */
export async function UploadFileAPI(
  name: string,
  data: File,
  progress?: (e: AxiosProgressEvent) => void | undefined
): Promise<string | null> {
  const dataBuf = new Uint8Array(await data.arrayBuffer())
  const dataMd5 = new Md5().appendByteArray(dataBuf).end()?.toString() ?? ''

  const formdata = new FormData()
  formdata.append(name, data)

  const result = await xazhAxios.post('/File/Upload', formdata, {
    headers: {
      'Custom-Filename': name.replace(/[^\x00-\x7F]/g, ''),
      'Custom-Fileuid': dataMd5,
    },
    onUploadProgress: progress
  })

  return result.data.code == 0 ? result.data.body : null
}

export async function GetFileInfoAPI(uid: string) {
  const result = await xazhAxios.get('/File/GetInfo/' + uid)

  return result ?? null
}

/**
 * Get file by post.
 */
export async function GetFilesAPI(uid: string, save: boolean = false): Promise<Buffer | null> {
  const result = await xazhAxios.post('/File/Get', {
    uid: uid, save: save
  })
  return result.data as Buffer ?? null
}

/**
 * Get bit file by get.
 */
export async function GetFileAPI(uid: string, save: boolean = false) {
  let url = '/File/Get/' + uid
  save ? url + '?save=true' : null
  const result = await xazhAxios.get(url)

  return result.data as Buffer ?? null
}