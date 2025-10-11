export type RefreshResponseType = {
  tokens?: {
          accessToken: string,
          refreshToken: string,
  },
  error: boolean,
  message?: string,
  validation?: {
    key: string,
    message: string,
  }[];
}