import type { Shop, StopReason } from '../constants/menu'

export type { Shop, StopReason }

export type MenuItemStatus =
  | {
      kind: 'available'
    }
  | {
      kind: 'stopped'
      reason: StopReason
      until: string | null
    }

export interface MenuItem {
  id: string
  title: string
  shop: Shop
  stock: number
  status: MenuItemStatus
  updatedAt: string
}

export interface StopItemPayload {
  reason: StopReason
  until: string | null
}
