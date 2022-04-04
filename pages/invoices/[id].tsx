import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'

import { PayInvoice } from 'components'
import { getProfileById } from 'lib/api'
import { getInvoice } from 'lib/invoices'
import { User, Invoice } from 'lib/types'


const Invoice: NextPage<{ user: User, invoice: Invoice }> = ({ user, invoice }) => {
  return (
    <>
    <Head>
      <title>
        {invoice.issuer} - {invoice.memo}
      </title>
    </Head>
    <PayInvoice user={user} invoice={invoice} />
    </>
  )
}

export default Invoice

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const invoice = await getInvoice(id)
  // todo: type lib/invoices
  // @ts-expect-error
  const user = await getProfileById(invoice.userId)
  return { props: { invoice, user } }
}
