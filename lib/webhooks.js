import { createHmac, timingSafeEqual } from 'crypto'
import getRawBody from 'raw-body'

import { getInvoice } from './api'
import { updateInvoice } from './db'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
const WEBHOOK_HEADER = 'X-Webhook-Signature'

function computeHmac(content) {
  return createHmac('sha256', WEBHOOK_SECRET).update(content).digest('hex')
}

export function verifyRequestSignature(requestSignature, body) {
  const contentSignature = computeHmac(body)
  return requestSignature === contentSignature.toUpperCase()
}

async function updateStoredInvoice(invoiceId) {
  try {
    const { correlationId, state } = await getInvoice(invoiceId)
    if (correlationId && state === 'PAID') {
      await updateInvoice(correlationId, { paid: true })
    }
  } catch (err) {}
}

export async function processEvent(eventType, data) {
  console.log(`EVENT ${eventType}: ${JSON.stringify(data)}`)
  if (eventType === 'invoice.updated' && data.entityId) {
    await updateStoredInvoice(data.entityId)
  }
}

export async function processRequest(req) {
  const sig = req.headers[WEBHOOK_HEADER.toLowerCase()]
  const rawBody = await getRawBody(req)
  const body = rawBody.toString('utf8')
  if (verifyRequestSignature(sig, body)) {
    const { eventType, data } = JSON.parse(body)
    await processEvent(eventType, data)
  }
}
