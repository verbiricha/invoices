const supportedCurrencies = ['BTC', 'USD', 'EUR', 'USDT', 'GBP'] as const

export type Currency = typeof supportedCurrencies[number]

export const isCurrencySupported = (value: string): value is Currency => {
  return (supportedCurrencies as unknown as string[]).indexOf(value) >= 0
}
