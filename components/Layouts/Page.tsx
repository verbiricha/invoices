import type { FC } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

export const Page: FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
