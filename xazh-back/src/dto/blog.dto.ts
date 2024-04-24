import { Rule, RuleType } from "@midwayjs/validate";

export class BlogInfoDTO {
  @Rule(RuleType.string().max(256).required())
  title: string

  @Rule(RuleType.string().max(200000).required())
  body: string

  // Not required.
  @Rule(RuleType.string().min(0).max(40))
  cover: string

  @Rule(RuleType.date())
  createtime: Date

  @Rule(RuleType.number().max(8))
  privacy: number

  @Rule(RuleType.number().max(32))
  type: number

  @Rule(RuleType.string().min(0).max(512))
  abstract: string

  @Rule(RuleType.array<string>().max(32))
  keywords: string[]

  @Rule(RuleType.object())
  wordcloud: object
}

export class BlogCommentDTO {
  @Rule(RuleType.string().length(24).required())
  bid: string

  @Rule(RuleType.string().max(1024).required())
  content: string

  @Rule(RuleType.array<string>().max(32))
  atwho: string[]

  @Rule(RuleType.string().length(24))
  cid: string
  @Rule(RuleType.string().max(32))
  replywho: string
}

export class StarFolderBlogDTO {
  @Rule(RuleType.string().max(64).required())
  name: string

  @Rule(RuleType.string().max(512))
  description: string

  @Rule(RuleType.string().max(64))
  newname: string

  @Rule(RuleType.string().max(256))
  cover: string

  @Rule(RuleType.number().max(8))
  privacy: number
}