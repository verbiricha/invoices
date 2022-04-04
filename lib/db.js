import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  rejectOnNotFound: false,
})

function isInThePast(date) {
  return date < Date.now()
}

const readInvoice = ({
  user_id,
  short_id,
  invoice_id,
  due_date,
  created_at,
  paid,
  amount,
  ...rest
}) => {
  return { 
    userId: user_id,
    shortId: short_id,
    invoiceId: invoice_id,
    dueDate: +due_date,
    createdAt: +created_at,
    status: paid ? 'PAID' : isInThePast(+due_date) ? 'EXPIRED' : 'UNPAID',
    amount: amount.toFixed(2),
    ...rest
  }
}

export async function getInvoice(invoiceShortId) {
  return prisma.invoices.findUnique({
    where: { short_id: invoiceShortId }
  }).then((inv) => inv && readInvoice(inv))
}

export async function updateInvoice(invoiceShortId, data) {
  return prisma.invoices.update({
    where: { short_id: invoiceShortId },
    data,
  })
}

export async function getInvoices(userId, { page = 1 }) {
  const where = {
    user_id: userId,
  }
  const skip = Math.max(0, page - 1) * 10
  const count = await prisma.invoices.count({ where })
  const invoices = await prisma.invoices.findMany({
    where,
    orderBy: {
      created_at: 'desc'
    },
    take: 10,
    skip,
  }).then((invoices) => invoices.map(readInvoice))

  return { count, invoices }
}

export async function getPaidInvoices(userId, { page = 1 }) {
  const where = {
    user_id: userId,
    paid: true,
  }
  const count = await prisma.invoices.count({ where })
  const invoices = await prisma.invoices.findMany({
    where,
    orderBy: {
      created_at: 'desc'
    },
    skip: Math.max(0, page - 1) * 10,
    take: 10,
  }).then((invoices) => invoices.map(readInvoice))

  return { count, invoices }
}

export async function getUnpaidInvoices(userId, { page = 1 }) {
  const where = {
    user_id: userId,
    paid: false,
    due_date: {
      gt: new Date()
    },
  }
  const count = await prisma.invoices.count({ where })
  const invoices = await prisma.invoices.findMany({
    where,
    orderBy: {
      created_at: 'desc'
    },
    skip: Math.max(0, page - 1) * 10,
    take: 10,
  }).then((invoices) => invoices.map(readInvoice))

  return { count, invoices }
}

export async function getExpiredInvoices(userId, { page = 1 }) {
  const where = {
    user_id: userId,
    paid: false,
    due_date: {
      lte: new Date()
    },
  }
  const count = await prisma.invoices.count({ where })
  const invoices = await prisma.invoices.findMany({
    where,
    orderBy: {
      created_at: 'desc'
    },
    skip: Math.max(0, page - 1) * 10,
    take: 10,
  }).then((invoices) => invoices.map(readInvoice))

  return { count, invoices }
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
      amount,
      currency,
    }
  }).then(readInvoice)
}

export async function getQuote(invoiceShortId) {
  const maybeQuote = await prisma.quotes.findUnique({
    where: { invoice_short_id: invoiceShortId }
  })
  if (maybeQuote && maybeQuote.amount) {
    return { ...maybeQuote, amount: maybeQuote.amount.toFixed(8) }
  } else {
    return maybeQuote
  }
}

export async function saveQuote(invoiceShortId, { quote, ln, onchain, expiration, amount }) {
  return prisma.quotes.upsert({
    where: { invoice_short_id: invoiceShortId },
    update: { quote_id: quote, ln, onchain, expiration, amount },
    create: { invoice_short_id: invoiceShortId, quote_id: quote, ln, onchain, expiration, amount },
  })
}
