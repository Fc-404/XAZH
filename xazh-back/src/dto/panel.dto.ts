import { Rule, RuleType } from "@midwayjs/validate"

export class PanelConfigurationDTO {
  @Rule(RuleType.string().max(32))
  group: string
  @Rule(RuleType.string().max(32).required())
  name: string
}

export class PanelSetConfigurationDTO extends PanelConfigurationDTO {
  @Rule(RuleType.any().required())
  value: any
}