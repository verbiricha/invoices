import { CurrencyAmount } from './currency-amount'
import { Currency } from './currency'

export interface Invoice {
  invoiceId: string
  amount: CurrencyAmount
  state: 'UNPAID' | 'PENDING' | 'PAID' | 'CANCELLED'
  created: string
  correlationId?: string
  description?: string
  issuerId: string
  receiverId: string
  payerId?: string
}

export interface CreateInvoice {
  correlationId?: string
  description?: string
  amount: CurrencyAmount
}

export interface InvoiceQuote {
  quoteId: string
  description?: string
  lnInvoice: string
  onchainAddress?: string
  expiration: string
  expirationInSec: number
  sourceAmount: CurrencyAmount
  targetAmount: CurrencyAmount
  conversionRate: {
    amount: string
    sourceCurrency: Currency
    targetCurrency: Currency
  }
}
