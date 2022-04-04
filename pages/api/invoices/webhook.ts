import type { NextApiRequest, NextApiResponse } from 'next'

import { processRequest } from 'lib/webhooks'

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === 'POST') {
    try {
      await processRequest(req)
    } catch (err) {
      console.error(err)
    }
    res.status(200)
  } else {
    res.status(405)
  }
  res.end()
}
