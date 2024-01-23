import { Md5 } from "ts-md5";
import { xazhAxios } from "../axios/xazh.axios";
import { AxiosProgressEvent } from "axios";

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
      'Custom-Filename': name,
      'Custom-MD5': dataMd5,
    },
    onUploadProgress: progress
  })

  return result.data.code == 0 ? result.data.body : null
}

export async function GetFileInfoAPI(md5: string) {
  const result = await xazhAxios.get('/File/GetInfo/' + md5)

  return result ?? null
}

/**
 * Get file by post.
 */
export async function GetFilesAPI(md5: string, save: boolean = false): Promise<Buffer | null> {
  const result = await xazhAxios.post('/File/Get', {
    md5: md5, save: save
  })
  return result.data as Buffer ?? null
}

/**
 * Get bit file by get.
 */
export async function GetFileAPI(md5: string, save: boolean = false) {
  let url = '/File/Get/' + md5
  save ? url + '?save=true' : null
  const result = await xazhAxios.get(url)

  return result.data as Buffer ?? null
}