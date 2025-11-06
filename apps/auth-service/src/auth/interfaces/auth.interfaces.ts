export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  email: string;
  sub: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  name: string;
  email: string;
}
