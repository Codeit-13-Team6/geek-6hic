import type { User } from "./user";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  introduce: string;
}

export interface LoginResult {
  ok: boolean;
  user?: User;
}

export interface SignUpResult {
  ok: boolean;
}

export interface OAuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthLoginResult extends OAuthTokenPair {
  user: User;
}
