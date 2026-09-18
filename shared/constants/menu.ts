export const SHOP_OPTIONS = [
  { value: 'kitchen', label: 'Кухня' },
  { value: 'bar', label: 'Бар' },
  { value: 'pastry', label: 'Кондитерская' },
] as const

export type Shop = (typeof SHOP_OPTIONS)[number]['value']

export const STOP_REASON_OPTIONS = [
  { value: 'out_of_stock', label: 'Закончились продукты' },
  { value: 'equipment', label: 'Сломалось оборудование' },
  { value: 'quality', label: 'Вопросы к качеству' },
  { value: 'menu_change', label: 'Позиция выведена из меню' },
] as const

export type StopReason = (typeof STOP_REASON_OPTIONS)[number]['value']

export const MENU_STATUS_OPTIONS = [
  { value: 'available', label: 'В продаже' },
  { value: 'stopped', label: 'В стоп-листе' },
] as const

export type MenuStatus = (typeof MENU_STATUS_OPTIONS)[number]['value']

export function isShop(value: unknown): value is Shop {
  return typeof value === 'string' && SHOP_OPTIONS.some((option) => option.value === value)
}

export function isStopReason(value: unknown): value is StopReason {
  return typeof value === 'string' && STOP_REASON_OPTIONS.some((option) => option.value === value)
}

export function isMenuStatus(value: unknown): value is MenuStatus {
  return typeof value === 'string' && MENU_STATUS_OPTIONS.some((option) => option.value === value)
}

export function getShopLabel(shop: Shop): string {
  return SHOP_OPTIONS.find((option) => option.value === shop)?.label ?? shop
}

export function getStopReasonLabel(reason: StopReason): string {
  return STOP_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? reason
}
