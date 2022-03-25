import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'
import { decodeJwt } from 'jose'

export default function Strike<P extends Record<string, any>>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'strike',
    name: 'Strike',
    type: 'oauth',
    wellKnown: `${process.env.STRIKE_IDENTITY_SERVER_URL}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: process.env.STRIKE_API_SCOPE,
        response_type: 'code',
      },
    },
    idToken: false,
    checks: ['pkce', 'state'],
    userinfo: {
      url: `${process.env.STRIKE_IDENTITY_SERVER_URL}/connect/userinfo`,
      async request({ tokens }) {
        return decodeJwt(tokens.access_token ?? '')
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.avatarUrl,
      }
    },
    options,
  }
}
