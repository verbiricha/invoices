import { Invoice } from './invoice'

export enum EventType {
  InvoiceCreated = 'invoice.created',
  InvoiceUpdated = 'invoice.updated',
}

export type WebhookEvent = {
  id: string
  created: string
  deliverySuccess: boolean
  webhookVersion: string
} & (
  | {
      eventType: EventType.InvoiceCreated
      data: { entityId: string }
    }
  | {
      eventType: EventType.InvoiceUpdated
      data: { entityId: string; changes: (keyof Invoice)[] }
    }
)
