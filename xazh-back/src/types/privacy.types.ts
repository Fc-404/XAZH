/**
 * The type of privacy.
 */

export enum PRIVACY_TYPE {
  public = 0,
  followers,      // user follows and user's followers
  onlyfriend,     // follow each other
  onlyself,
}