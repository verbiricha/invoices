import {
  createInvoice as createStrikeInvoice,
  getInvoice as getStrikeInvoice,
  createQuote,
} from './api'
import {
  createInvoice as createDbInvoice,
  getInvoices as getDbInvoices,
  getInvoice as getDbInvoice,
  getQuote as getDbQuote,
  saveQuote,
} from './db'
import { generateShortId } from './id'

export async function createInvoice(
  handle,
  { userId, amount, currency, issuer, customer, memo, dueDate }
) {
  const shortId = generateShortId()
  const { invoiceId } = await createStrikeInvoice(handle, {
    correlationId: shortId,
    amount,
    currency,
    description: `${issuer}: ${memo}`.slice(0, 200)
  })
  const invoice = await createDbInvoice({
    userId,
    shortId,
    invoiceId,
    issuer,
    customer,
    memo,
    dueDate,
    amount,
    currency,
  })
  return invoice
}

function invoiceStatus({ dueDate }, { state }) {
  if (state !== 'PAID' && dueDate < Date.now()) {
    return 'EXPIRED'
  }
  if (state === 'CANCELLED') {
    return 'UNPAID'
  }
  return state
}

export async function getInvoice(invoiceShortId) {
  const { invoiceId, ...rest } = await getDbInvoice(invoiceShortId)
  const invoice = await getStrikeInvoice(invoiceId)
  return { ...rest, invoiceId, invoice, status: invoiceStatus(rest, invoice) }
}

export async function getInvoices(userId) {
  const invoices = await getDbInvoices(userId)
  return Promise.all(
    invoices.map(async ({ invoiceId, ...rest }) => {
      const invoice = await getStrikeInvoice(invoiceId)
      return { ...rest, invoiceId, invoice, status: invoiceStatus(rest, invoice) }
    })
  )
}

export async function getQuote(invoiceShortId) {
  const { invoiceId } = await getDbInvoice(invoiceShortId)
  const maybeQuote = await getDbQuote(invoiceShortId)
  const now = Date.now()

  if (maybeQuote && Date.parse(maybeQuote.expiration) > now) {
    return maybeQuote
  }

  const { quoteId, lnInvoice, onchainAddress, expiration, sourceAmount } = await createQuote(
    invoiceId
  )
  const quote = await saveQuote(invoiceShortId, {
    quote: quoteId,
    ln: lnInvoice,
    onchain: onchainAddress,
    expiration,
    amount: sourceAmount?.amount,
  })

  return quote
}
