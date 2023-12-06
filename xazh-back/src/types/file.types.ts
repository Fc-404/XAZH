/**
 * Types of file is allowed.
 */

export enum FILE_TYPE {
  // Text
  txt = 'text/txt',
  htmp = 'text/html',
  md = 'text/md',

  // Audio
  mp3 = 'audio/mp3',
  wav = 'audio/wav',
  ogg = 'audio/ogg',
  aac = 'audio/aac',

  // Video
  mp4 = 'video/mp4',
  webm = 'video/webm',

  // Picture
  jpg = 'image/jpg',
  jpeg = 'image/jpeg',
  png = 'image/png',
  gif = 'image/gif',
  svg = 'image/svg',
  apng = 'image/apng',
  webp = 'image/webp',
  avif = 'image/avif',

  // Other
  zip = 'other/zip',
  rar = 'other/rar',
  '7z' = 'other/7z',
}