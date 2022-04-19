# Paymeinb.tc


## Installation

Install dependencies:

```sh
yarn
```

## Development

This is a basic Next.js app. Run the development server:

```bash
yarn dev
```

## Configuration

All configuration is done through environment variables. Default values are provided in `.env.development` for development.

Available options are:

- `STRIKE_API_TOKEN`
   Token for the Strike API

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

- `WEBHOOK_SECRET`
   Secret used to sign webhook payload bodies coming from Strike.

- `DATABASE_URL`
  URL of Postgres database.

## Demo

View a demo at: https://paymeinb.tc
