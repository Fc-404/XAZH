import { Provide } from "@midwayjs/core";
import ValidMail from '../model/validcode.mail.model'

@Provide()
export class MailService {

  /**
   * Save mail valid code to the Database.
   * And delete the code after 5 minute.
   * @param mail mail
   * @param code code
   * @returns true always.
   */
  async saveValidCode(mail: string, code: string): Promise<boolean> {
    const findOneR = await ValidMail.model.findById(mail).exec()

    if (!findOneR) {
      await ValidMail.model.create({
        _id: mail, code: code
      })
    } else {
      await findOneR.updateOne({ code: code }).exec()
    }

    setTimeout(() => {
      ValidMail.model.findByIdAndDelete(mail).exec()
    }, 300000)

    return true
  }

  /**
   * Verify EMail code
   * @param mail the mail to be verified.
   * @param code the code we sent.
   * @returns return true if code correct else return false.
   */
  async verifyCode(mail: string, code): Promise<boolean> {
    return (
      await ValidMail.model.findOne({ _id: mail, code: code }).exec()
    ) ? true : false
  }
}