import { IntlProvider } from 'react-intl'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/fira-code'

import { Page } from 'components'
import { theme } from 'theme'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <IntlProvider locale="en">
          <Page>
            <Component {...pageProps} />
          </Page>
        </IntlProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
