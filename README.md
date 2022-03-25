# Strike OAuth Exmaple

> Simple proof of concept that demonstrates Strike OAuth Connect

- [Installation](#installation)
- [Development](#development)
- [Configuration](#configuration)
- [Demo](#demo)

## Installation

Install dependencies:

```sh
npm install
```

## Development

This is a basic Next.js app. Run the development server:

```bash
npm run dev
```

## Configuration

All configuration is done through environment variables. Default values are provided in [.env.development](https://github.com/mrfelton/strike-oauth-example/blob/master/.env.development) for development.

Available options are:

- `STRIKE_API_URL`  
   URL of the Strike API. e.g. https://api.strike.me/v1

- `STRIKE_API_SCOPE`  
  API Scopes to request. See https://docs.strike.me/api/ for possible values. e.g. 'openid offline_access profile partner.invoice.read'

- `STRIKE_IDENTITY_SERVER_URL`  
  URL of the Strike Identity Server. e.g. https://auth.strike.me

- `STRIKE_IDENTITY_SERVER_CLIENT_ID`  
  Strike OAuth Client ID. e.g. strike-oauth-example

- `STRIKE_IDENTITY_SERVER_CLIENT_SECRET`  
   Strike OAuth Client Secret. e.g. 1234567890

- `NEXTAUTH_SECRET`  
   Secret used to encrypt the NextAuth.js JWT. e.g. jae6Yoox5eeMaewuzookeib5ieMoo9ce

## Demo

View a demo at: https://strike-oauth-example.vercel.app/

_Note: this is connected to the `next` sandbox environment so you will need an account on that sandbox in order to login._

<a href="https://strike-oauth-example.vercel.app/"><img width="836" alt="image" src="https://user-images.githubusercontent.com/200251/154948065-b21dfbce-b28d-4026-b7d4-de4c215df71a.png"></a>
