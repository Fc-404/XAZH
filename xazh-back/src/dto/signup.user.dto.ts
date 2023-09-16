import { Rule, RuleType } from '@midwayjs/validate'
import { ValidMailDTO } from './mail.dto'

export class SignupUserDTO extends ValidMailDTO {
  @Rule(RuleType.date().required())
  date: string

  @Rule(RuleType.string().required().max(16).min(1))
  user: string

  @Rule(RuleType.string().required())
  pswd: string
}

export class SigninUserDTO {
  @Rule(RuleType.string().required())
  account: string
  @Rule(RuleType.string().required())
  pswd: string
}

export class TokenDTO {
  @Rule(RuleType.string().required().max(16).min(1))
  user: string
  @Rule(RuleType.string().required())
  token: string
  @Rule(RuleType.date().required())
  date: string
}