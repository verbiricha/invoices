import NextAuth, { DefaultSession, TokenSet } from 'next-auth'
import { JWT } from 'next-auth/jwt'

/**Extend the built-in types for Session */
declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's access token. */
      user: DefaultUser
      accessToken: string
    } & DefaultSession['user']
  }

  interface TokenAutoRefresh {
    user: {
      /** The user's access token. */
      accessToken: string
      refreshToken: string
      accessTokenExpires: number
    } & TokenSet['user']
  }
}

/**Extend the built-in types for JWT */
declare module 'next-auth/jwt' {
  interface JWT {
    error: string
    accessTokenExpires: number
    refreshToken: string
    user: DefaultUser
  }
}
