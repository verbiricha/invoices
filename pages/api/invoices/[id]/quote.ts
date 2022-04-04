import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import { getProfileById } from 'lib/api.js'
import { getInvoice, getQuote } from 'lib/invoices'


export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { id } = req.query
  const session = await getSession({ req })

  if (session) {
    if (req.method === 'GET') {
      const invoice = await getInvoice(id)
      if (!invoice) {
        res.status(404)
      } else if (invoice.status === 'EXPIRED' || invoice.status === 'PAID') {
        res.status(404).json({ error: 'Quote not found' })
      } else {
        const quote = await getQuote(id)
        res.status(200).json(quote)
      }
    } else {
      res.status(405).json({ error: 'Method not allowed, only GET' })
    }
  } else {
    res.status(401)
  }
  res.end()
}
