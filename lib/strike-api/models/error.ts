import { CurrencyAmount } from './currency-amount'
import { Currency } from './currency'

export enum ErrorCode {
  NotFound = 'NOT_FOUND',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  MaintenanceMode = 'MAINTENANCE_MODE',
  RateLimitExceeded = 'RATE_LIMIT_EXCEEDED',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  InvalidData = 'INVALID_DATA',
  InvalidDataQuery = 'INVALID_DATA_QUERY',
  UnprocessableEntity = 'UNPROCESSABLE_ENTITY',
  InvalidStateForInvoicePaid = 'INVALID_STATE_FOR_INVOICE_PAID',
  InvalidStateForInvoiceCancelled = 'INVALID_STATE_FOR_INVOICE_CANCELLED',
  InvalidRecipient = 'INVALID_RECIPIENT',
  ProcessingPayment = 'PROCESSING_PAYMENT',
  DuplicateInvoice = 'DUPLICATE_INVOICE',
  SelfPaymentNotAllowed = 'SELF_PAYMENT_NOT_ALLOWED',
  InvalidAmount = 'INVALID_AMOUNT',
  AmountTooHigh = 'AMOUNT_TOO_HIGH',
  UserCurrencyUnavailable = 'USER_CURRENCY_UNAVAILABLE',
  LnUnavailable = 'LN_UNAVAILABLE',
  ExchangeRateNotAvailable = 'EXCHANGE_RATE_NOT_AVAILABLE',
}

export enum ValidationErrorCode {
  InvalidData = 'INVALID_DATA',
  InvalidDataRequired = 'INVALID_DATA_REQUIRED',
  InvalidDataMinlength = 'INVALID_DATA_MINLENGTH',
  InvalidDataMaxlength = 'INVALID_DATA_MAXLENGTH',
  InvalidDataValue = 'INVALID_DATA_VALUE',
  InvalidDataCurrency = 'INVALID_DATA_CURRENCY',
}

type ValidationFieldError<TCode, TValues = {}> = {
  code: TCode
  values: { field: string } & TValues
}

export type ValidationError = { message: string } & (
  | { code: ValidationErrorCode.InvalidData }
  | ValidationFieldError<ValidationErrorCode.InvalidDataRequired>
  | ValidationFieldError<ValidationErrorCode.InvalidDataMinlength, { minLength: number }>
  | ValidationFieldError<ValidationErrorCode.InvalidDataMaxlength, { maxLength: number }>
  | ValidationFieldError<ValidationErrorCode.InvalidDataValue>
  | ValidationFieldError<ValidationErrorCode.InvalidDataCurrency, { currency: Currency }>
)

type ErrorData = { message: string } & (
  | {
      code: ErrorCode.NotFound
      status: 404
    }
  | {
      code: ErrorCode.InternalServerError
      status: 500
    }
  | {
      code: ErrorCode.MaintenanceMode
      status: 503
    }
  | {
      code: ErrorCode.RateLimitExceeded
      status: 429
    }
  | {
      code: ErrorCode.Unauthorized
      status: 401
    }
  | {
      code: ErrorCode.Forbidden
      status: 403
    }
  | {
      code: ErrorCode.InvalidData
      status: 400
      validationErrors: { [key: string]: ValidationError }
    }
  | {
      code: ErrorCode.InvalidDataQuery
      status: 400
    }
  | {
      code: ErrorCode.UnprocessableEntity
      status: 422
    }
  | {
      code: ErrorCode.InvalidStateForInvoicePaid
      status: 422
    }
  | {
      code: ErrorCode.InvalidStateForInvoiceCancelled
      status: 422
    }
  | {
      code: ErrorCode.InvalidRecipient
      status: 422
    }
  | {
      code: ErrorCode.ProcessingPayment
      status: 422
    }
  | {
      code: ErrorCode.DuplicateInvoice
      status: 409
      values: { correlationId: string }
    }
  | {
      code: ErrorCode.SelfPaymentNotAllowed
      status: 422
    }
  | {
      code: ErrorCode.InvalidAmount
      status: 422
    }
  | {
      code: ErrorCode.AmountTooHigh
      status: 422
      values: { paymentLimit: CurrencyAmount }
    }
  | {
      code: ErrorCode.UserCurrencyUnavailable
      status: number
      values: { currency: Currency }
    }
  | {
      code: ErrorCode.LnUnavailable
      status: 422
    }
  | {
      code: ErrorCode.ExchangeRateNotAvailable
      status: 422
    }
)

export interface ErrorDetails {
  traceId?: string
  data: ErrorData
  debug?: {
    full: string
    body?: string
  }
}
