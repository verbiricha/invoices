import {
  createInvoice as createStrikeInvoice,
  createInvoiceForHandle as createStrikeInvoiceForHandle,
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
  const { invoiceId } = await createStrikeInvoiceForHandle(handle, {
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

export async function getInvoice(invoiceShortId) {
  const invoice = await getDbInvoice(invoiceShortId)
  return invoice
}

export async function getQuote(invoiceShortId) {
  const maybeQuote = await getDbQuote(invoiceShortId)
  const now = Date.now()

  if (maybeQuote && Date.parse(maybeQuote.expiration) > now) {
    return maybeQuote
  }

  const { invoiceId } = await getInvoice(invoiceShortId)
  const { quoteId, lnInvoice, onchainAddress, expiration, sourceAmount } = await createQuote(invoiceId)
  const quote = await saveQuote(invoiceShortId, {
    quote: quoteId,
    ln: lnInvoice,
    onchain: onchainAddress,
    expiration,
    amount: sourceAmount?.amount,
  })

  return quote
}
