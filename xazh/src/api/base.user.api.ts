import { xazhAxios } from "../axios/xazh.axios";
import cookie from 'js-cookie'
import { base64WithDate } from "../util/encodeMsg.tool";

/**
 * Verify user's token.
 * @param param the object include id, token, date
 * @returns true if token is valid, otherwise false
 */
export async function VerifyTokenAPI(param: object | null = null) {
  let id = param ? null : cookie.get('id') || null
  let token = param ? null : cookie.get('token') || null
  let data = param ? null : base64WithDate(token ?? '')

  const result = await xazhAxios.post("/User/VerifyToken", param ?? {
    id: id,
    token: data?.data,
    date: data?.date
  });

  return result.data.code == 0 ? true : false
}

/**
 * Send a mail with a code to user to verify his mail.
 * @param mail the user's mail
 * @returns true if send successfully, otherwise false
 */
export async function SendMailValidCodeAPI(mail: string) {
  const result = await xazhAxios.post("/User/SendMailValidCode", {
    mail: mail
  })

  return result.data.body ? true : false
}

/**
 * Judge if the user is exist.
 * @param user the user's name
 * @returns true if user is exist, otherwise false
 */
export async function UserExistAPI(user: string) {
  const result = await xazhAxios.get("/User/isExist/" + user)

  return result.data.code == 0 ? true : false
}

/**
 * Signup a user.
 * @param param
 * the object include user, pswd, mail, code and tate
 * @returns object include code and body
 */
export async function UserSignupAPI(param: object) {
  const result = await xazhAxios.post("/User/Signup", param)

  return {
    code: result.data.code,
    body: result.data.body,
  }
}

/**
 * Signin.
 * @param param the object include account, pswd
 * @returns object include code and body
 */
export async function UserSigninAPI(param: object) {
  const result = await xazhAxios.post("/User/Signin", param)

  return {
    code: result.data.code,
    body: result.data.body,
  }
}

/**
 * Get user's information.
 * @returns 
 */
export async function GetUserInfoAPI(withparam?: boolean) {
  const param: any = {}
  if (withparam) {
    const tokenData = base64WithDate(cookie.get('token') || '')
    param['Custom-ID'] = cookie.get('id') || ''
    param['Custom-Token'] = tokenData?.data || ''
    param['Custom-Date'] = tokenData?.date.toISOString() || ''
  }
  const result = await xazhAxios.post("/User/GetUserInfo", null, {
    headers: withparam ? {
      'Custom-ID': param['Custom-ID'],
      'Custom-Token': param['Custom-Token'],
      'Custom-Date': param['Custom-Date']
    } : {}
  })

  return {
    code: result.data.code,
    body: result.data.body,
  }
}