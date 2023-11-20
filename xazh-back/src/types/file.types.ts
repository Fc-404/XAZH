/**
 * Types of file is allowed.
 */

export enum FILE_TYPE {
  // Text
  txt = 'txt',
  htmp = 'html',
  md = 'md',

  // Audio
  mp3 = 'mp3',
  wav = 'wav',
  ogg = 'ogg',
  aac = 'aac',

  // Video
  mp4 = 'mp4',
  webm = 'webm',

  // Picture
  jpg = 'jpg',
  jpeg = 'jpeg',
  png = 'png',
  gif = 'gif',
  svg = 'svg',
  apng = 'apng',
  webp = 'webp',
  avif = 'avif',

  // Other
  zip = 'zip',
  rar = 'rar',
  '7z' = '7z',
}