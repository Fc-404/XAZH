import { Rule, RuleType } from '@midwayjs/validate'
import { ValidMailDTO } from './mail.dto'

export class SignupUserDTO extends ValidMailDTO {
  @Rule(RuleType.string().required().max(16).min(1))
  user: string

  @Rule(RuleType.string().required().max(16).min(6))
  pswd: string
}