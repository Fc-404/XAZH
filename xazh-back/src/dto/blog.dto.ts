import { Rule, RuleType } from "@midwayjs/validate";

export class BlogInfoDTO {
  @Rule(RuleType.string().max(256).required())
  title: string

  @Rule(RuleType.string().max(100000).required())
  body: string

  // Not required.
  @Rule(RuleType.date())
  createtime: Date

  @Rule(RuleType.number().max(8))
  privacy: number

  @Rule(RuleType.number().max(32))
  type: number
  
  @Rule(RuleType.string().max(512))
  abstract: string

  @Rule(RuleType.array<string>().max(32))
  keywords: string[]

  @Rule(RuleType.object())
  wordcloud: object
}

export class BlogCommentDTO {
  @Rule(RuleType.string().max(256).required())
  bid: string

  @Rule(RuleType.string().max(1024).required())
  content: string

  @Rule(RuleType.array<string>().max(32))
  atwho: string[]

  @Rule(RuleType.string().max(64))
  cid: string
  @Rule(RuleType.string().max(32))
  replywho: string
}