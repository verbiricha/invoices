import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import { getProfileById } from 'lib/api'
import { createInvoice } from 'lib/invoices'
import {
  getInvoices,
  getPaidInvoices,
  getUnpaidInvoices,
  getExpiredInvoices
} from 'lib/db'
import type { Invoice } from 'lib/types'
import { PAID, UNPAID, EXPIRED } from 'lib/types'

function parsePage(n: string | null): number {
  if (!n) { return 1 }
  const maybeNumber = parseInt(n)
  if (isNaN(maybeNumber)) {
    return 1
  }
  return maybeNumber
}

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    // @ts-expect-error
    const userId = session.user.id
    const token = session.accessToken
    if (req.method === 'POST') {
      const { handle } = await getProfileById(userId)
      const invoiceRequest = { ...req.body, userId }
      const invoice = await createInvoice(token, invoiceRequest)
      res.status(201).json(invoice)
    } else if (req.method === 'GET') {
      const { status } = req.query
      const page = parsePage(req.query.page as string)
      const opts = { page }

      if (status == PAID) {
        const invoices = await getPaidInvoices(userId, opts)
        res.status(200).json(invoices)
      } else if (status == UNPAID) {
        const invoices = await getUnpaidInvoices(userId, opts)
        res.status(200).json(invoices)
      } else if (status == EXPIRED) {
        const invoices = await getExpiredInvoices(userId, opts)
        res.status(200).json(invoices)
      } else {
        const invoices = await getInvoices(userId, opts)
        res.status(200).json(invoices)
      }
    } else {
      res.status(405).json({ error: 'Method not allowed, only GET and POST' })
    }
  } else {
    res.status(401)
  }
  res.end()
}
