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

export const createInvoice = async (handle, { correlationId, amount, currency, description }) => {
  const { data } = await client.post(`/invoices/handle/${handle}`, {
    amount: { amount, currency },
    description,
    correlationId,
  })
  return data
}

export const getInvoice = async (id) => {
  const { data } = await client.get(`/invoices/${id}`)
  return data
}

export const createQuote = async (id) => {
  const { data } = await client.post(`/invoices/${id}/quote`)
  console.log('quote')
  console.log(data)
  return data
}
