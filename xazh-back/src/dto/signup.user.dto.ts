import { Rule, RuleType } from '@midwayjs/validate'

export class SignupUserDTO {
  @Rule(RuleType.string().required())
  user: string

  @Rule(RuleType.string().required())
  pswd: string

  @Rule(RuleType.string().required()
    .pattern(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/))
  mail: string
}