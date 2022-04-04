import type { FC } from 'react'

import { Flex } from '@chakra-ui/react'

import { Footer } from './Footer'
import { Header } from './Header'

export const Page: FC = ({ children }) => {
  return (
    <Flex flexDirection="column" height="100vh">
      <Header />
      {children}
      <Footer />
    </Flex>
  )
}
