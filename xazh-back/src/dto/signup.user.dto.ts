import { Rule, RuleType } from '@midwayjs/validate'
import { ValidMailDTO } from './mail.dto'

export class SignupUserDTO extends ValidMailDTO {
  @Rule(RuleType.date().required())
  date: string

  @Rule(RuleType.string().max(16).min(1).required())
  user: string

  @Rule(RuleType.string().max(4096).required())
  pswd: string
}

export class SigninUserDTO {
  @Rule(RuleType.string().max(64).required())
  account: string
  @Rule(RuleType.string().max(512).required())
  pswd: string
}

export class TokenDTO {
  @Rule(RuleType.string().max(16).min(1).required())
  user: string
  @Rule(RuleType.string().max(4096).required())
  token: string
  @Rule(RuleType.date().required())
  date: string
}