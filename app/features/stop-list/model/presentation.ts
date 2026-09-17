import type { MenuItemStatus, Shop, StopReason } from '#shared/types/menu'

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
}

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Оборудование',
  quality: 'Качество',
  menu_change: 'Изменение меню',
}

export const SHOP_OPTIONS = [
  {
    value: 'kitchen',
    label: SHOP_LABELS.kitchen,
  },
  {
    value: 'bar',
    label: SHOP_LABELS.bar,
  },
  {
    value: 'pastry',
    label: SHOP_LABELS.pastry,
  },
] satisfies readonly {
  value: Shop
  label: string
}[]

export const STATUS_OPTIONS = [
  {
    value: 'available',
    label: 'В продаже',
  },
  {
    value: 'stopped',
    label: 'В стоп-листе',
  },
] satisfies readonly {
  value: MenuItemStatus['kind']
  label: string
}[]

export const STOP_REASON_OPTIONS = [
  {
    value: 'out_of_stock',
    label: 'Закончились продукты',
  },
  {
    value: 'equipment',
    label: 'Сломалось оборудование',
  },
  {
    value: 'quality',
    label: 'Вопросы к качеству',
  },
  {
    value: 'menu_change',
    label: 'Позиция выведена из меню',
  },
] satisfies readonly {
  value: StopReason
  label: string
}[]
