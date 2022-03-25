interface UserCurrency {
  currency: string
  isInvoiceable: boolean }

export interface User {
  handle: string
  avatarUrl?: string
  currencies: UserCurrency[]
}

export const ALL = 'ALL'
export const PAID = 'PAID'
export const UNPAID = 'UNPAID'
export const EXPIRED = 'EXPIRED'

export type InvoiceStatuses = typeof ALL | typeof PAID | typeof UNPAID | typeof EXPIRED

export interface Invoice {
  shortId: string
  issuer: string
  customer: string
  amount: string
  currency: string
  dueDate: Date
  createdAt?: Date
  memo: string
  status: InvoiceStatuses
}

export interface Quote {
  ln: string
  onchain?: string
  amount?: string
  expiration: string
}
