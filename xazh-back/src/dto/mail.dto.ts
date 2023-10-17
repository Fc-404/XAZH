import { Rule, RuleType } from "@midwayjs/validate";

export class MailDTO {
  @Rule(RuleType.string().required()
    .pattern(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/))
  mail: string
}

export class ValidMailDTO extends MailDTO {
  @Rule(RuleType.string().max(6).min(4).required())
  code: string
}