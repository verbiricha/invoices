import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  rejectOnNotFound: false,
})

const readInvoice = ({
  user_id,
  short_id,
  invoice_id,
  due_date,
  created_at,
  ...rest
}) => {
  return { 
    userId: user_id,
    shortId: short_id,
    invoiceId: invoice_id,
    dueDate: +due_date,
    createdAt: +created_at,
    ...rest
  }
}

export async function getInvoice(invoiceShortId) {
  return prisma.invoices.findUnique({
    where: { short_id: invoiceShortId }
  }).then((inv) => inv && readInvoice(inv))
}

export async function getInvoices(userId) {
  return prisma.invoices.findMany({
    where: { user_id: userId },
    orderBy: {
      created_at: 'desc'
    },
  }).then((invoices) => invoices.map(readInvoice))
}

export async function createInvoice({ userId, shortId, invoiceId, issuer, customer, dueDate, memo, amount, currency }) {
  return prisma.invoices.create({
    data: {
      user_id: userId,
      short_id: shortId,
      invoice_id: invoiceId,
      issuer,
      customer,
      due_date: new Date(dueDate),
      memo,
      amount: String(amount),
      currency,
    }
  }).then(readInvoice)
}

export async function getQuote(invoiceShortId) {
  return prisma.quotes.findUnique({
    where: { invoice_short_id: invoiceShortId }
  })
}

export async function saveQuote(invoiceShortId, { quote, ln, onchain, expiration, amount }) {
  return prisma.quotes.upsert({
    where: { invoice_short_id: invoiceShortId },
    update: { quote_id: quote, ln, onchain, expiration, amount },
    create: { invoice_short_id: invoiceShortId, quote_id: quote, ln, onchain, expiration, amount },
  })
}
