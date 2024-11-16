// interface/AppleMusicUser.ts
export interface AppleMusicUser {
  storefront: string;
  name?: string;
  handle?: string;
  href?: string;
  profilePicture?: {
    url: string;
  };
}
