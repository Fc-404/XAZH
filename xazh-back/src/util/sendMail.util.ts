/**
 * Send Email
*/

import { createTransport } from "nodemailer";
import outlookConfig from '../config/outlook.config'

const outlookMail = createTransport({
  host: outlookConfig.host,
  port: outlookConfig.port,
  auth: outlookConfig.auth
})

// Via Outlook
export async function sendMailByOutlook(
  to: string,
  title: string,
  body: string): Promise<boolean> {
  let result = await outlookMail.sendMail({
    from: outlookConfig.auth.user,
    to: to,
    subject: title,
    html: body
  })

  return result.accepted.length ? true : false
}