import { useEffect } from 'react'

import Head from 'next/head'
import { Container } from '@chakra-ui/react'
import type { NextPage, GetServerSideProps } from 'next'
import { useSession, getSession, signIn, signOut } from 'next-auth/react'

import { Login, Invoices } from 'components'
import { getProfileById } from 'lib/api'
import type { User, Invoice } from 'lib/types'

interface HomeProps {
  user: User
}

const Home: NextPage<HomeProps> = ({ user }) => {
  const { data: session } = useSession()
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn() // Force sign in to hopefully resolve error
    }
  }, [session])

  return (
    <>
      <Head>
        <title>
        {session ? `Invoices - ${session.user.name}` : "Log in with Strike"}
        </title>
      </Head>
      <Container maxW="container.xl">
        {session ? <Invoices user={user} /> : <Login />}
      </Container>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session) {
    // @ts-expect-error
    const userId = session.user.id
    const user = await getProfileById(userId)
    return { props: { user } }
  } else {
    return { props:{  } }
  }
}
