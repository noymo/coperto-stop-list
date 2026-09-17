export const SHOPS = ['kitchen', 'bar', 'pastry'] as const

type TShop = (typeof SHOPS)[number]

export type { TShop as Shop }

export const STOP_REASONS = ['out_of_stock', 'equipment', 'quality', 'menu_change'] as const

type TStopReason = (typeof STOP_REASONS)[number]

export type { TStopReason as StopReason }

type TMenuItemStatus =
  | {
      kind: 'available'
    }
  | {
      kind: 'stopped'
      reason: TStopReason
      until: string | null
    }

export type { TMenuItemStatus as MenuItemStatus }

interface IMenuItem {
  id: string
  title: string
  shop: TShop
  stock: number
  status: TMenuItemStatus
  updatedAt: string
}

export type { IMenuItem as MenuItem }

interface IStopItemPayload {
  reason: TStopReason
  until: string | null
}

export type { IStopItemPayload as StopItemPayload }
