import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import { getProfileById } from 'lib/api.js'
import { createInvoice, getInvoices } from 'lib/invoices'
import type { Invoice } from 'lib/types'

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    // @ts-expect-error
    const userId = session.user.id
    if (req.method === 'POST') {
      const { handle } = await getProfileById(userId)
      const invoiceRequest = { ...req.body, userId }
      const invoice = await createInvoice(handle, invoiceRequest)
      res.status(201).json(invoice)
    } else if (req.method === 'GET') {
      const invoices = await getInvoices(userId)
      res.status(200).json(invoices)
    } else {
      res.status(405).json({ error: 'Method not allowed, only GET and POST' })
    }
  } else {
    res.status(401)
  }
  res.end()
}
