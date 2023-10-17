import { Rule, RuleType } from "@midwayjs/validate";
import { TokenDTO } from "./signup.user.dto";

export class PConfDTO extends TokenDTO {
  @Rule(RuleType.string().max(64).required())
  version: string

  // Header
  @Rule(RuleType.boolean())
  headerProgress: boolean

  @Rule(RuleType.boolean())
  headerTitleRoll: boolean

  // Style
  @Rule(RuleType.string().max(32))
  stylePrimaryColor: string

  @Rule(RuleType.boolean())
  stylePageAnimation: boolean

  // Blogs Editor
  @Rule(RuleType.number().min(10000).max(180000))
  blogsEditorAutoSave: number
}