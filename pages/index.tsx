import { useEffect } from 'react'

import { Container } from '@chakra-ui/react'
import type { NextPage, GetServerSideProps } from 'next'
import { useSession, getSession, signIn, signOut } from 'next-auth/react'

import { Login, Invoices } from 'components'
import { getProfileById } from 'lib/api'
import { getInvoices } from 'lib/invoices'
import type { User, Invoice } from 'lib/types'

interface HomeProps {
  user: User
  invoices: any
}

const Home: NextPage<HomeProps> = ({ invoices, user }) => {
  const { data: session } = useSession()
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn() // Force sign in to hopefully resolve error
    }
  }, [session])

  return (
    <Container maxW="container.xl">
      {session ? <Invoices invoices={invoices} user={user} /> : <Login />}
    </Container>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session) {
    // @ts-expect-error
    const userId = session.user.id
    const user = await getProfileById(userId)
    const invoices = await getInvoices(userId)
    return { props: { invoices, user } }
  } else {
    return { props:{  } }
  }
}
