import cookie from "js-cookie";
import { xazhAxios } from "../axios/xazh.axios";

/**
 * Upload the configuration to the server.
 * @param pconf
 * @returns true if success.
 */
export async function UploadPConfAPI(pconf: any = null) {
  if (cookie.get('pconf/useLocal') == 'true')
    return

  if (pconf == null) {
    pconf = cookie.get('pconf')
  }

  try {
    pconf = JSON.parse(pconf)
  } catch {
    console.warn('The local configuration have error. Will not be upload.');
    return
  }
  const { version, date, ...pconfT } = pconf

  const result = await xazhAxios.post('/User/Config/PConf/Upload', {
    version: version,
    ...pconfT
  })

  return result.data.code == 0 ? true : false
}

/**
 * Sync the configuration with the server.
 * @param version The version of the configuration.
 * @returns 
 */
export async function PConfSyncAPI(version: string) {
  const result = await xazhAxios.post('/User/Config/PConf/Sync', {
    version: version
  })

  return {
    code: result.data.code,
    body: result.data.body
  }
}