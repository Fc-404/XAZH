export enum BLOG_TYPE {
  original = 1,
  repost,
  modified,
}

export function getBlogTypeName(type: BLOG_TYPE): string {
  switch (type) {
    case BLOG_TYPE.original:
      return '原创'
    case BLOG_TYPE.repost:
      return '转载'
    case BLOG_TYPE.modified:
      return '二创'
  }
}

export function getBlogTypeColor(type: BLOG_TYPE): string {
  switch (type) {
    case BLOG_TYPE.original:
      return '#5cdbd3'
    case BLOG_TYPE.repost:
      return '#73d13d'
    case BLOG_TYPE.modified:
      return '#ffc53d'
  }
}
