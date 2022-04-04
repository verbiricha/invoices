import axios from 'axios'

const client = axios.create({
  baseURL: process.env.STRIKE_API_URL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.STRIKE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

export const getProfileById = async (id) => {
  const { data } = await client.get(`/accounts/${id}/profile`)
  return data
}

export const getProfileByHandle = async (handle) => {
  const { data } = await client.get(`/accounts/handle/${handle}/profile`)
  return data
}

export const createInvoiceForHandle = async (handle, { correlationId, amount, currency, description }) => {
  const { data } = await client.post(`/invoices/handle/${handle}`, {
    amount: { amount: String(amount), currency },
    description,
    correlationId,
  })
  return data
}

export const createInvoice = async (token, { correlationId, amount, currency, description }) => {
  const config = {
    baseURL: process.env.STRIKE_API_URL,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const { data } = await axios.post('/invoices', {
    amount: { amount: String(amount), currency },
    description,
    correlationId,
  }, config)
  return data
}

export const getInvoice = async (id) => {
  const { data } = await client.get(`/invoices/${id}`)
  return data
}

export const createQuote = async (id) => {
  const { data } = await client.post(`/invoices/${id}/quote`)
  return data
}

export const createSubscription = async (url) => {
  const { data } = await client.post(`/subscriptions`, {
    webhookUrl: url,
    webhookVersion: 'v1',
    secret: process.env.WEBHOOK_SECRET,
    enabled: true,
    eventTypes: ['invoice.updated']
  })
  return data
}

// createSubscription("https://invoices-theta.vercel.app")

export const getEvents = async () => {
  const { data } = await client.get('/events')
  return data
}

export const getFilteredEvents = async ({ eventType }) => {
  const { data } = await client.get(`/events?$filter=eventType%20eq%20%27${eventType}%27`)
  return data
}
