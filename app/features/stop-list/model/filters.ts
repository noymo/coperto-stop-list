import type { MenuItemStatus, Shop } from '#shared/types/menu'

type TStatusFilter = MenuItemStatus['kind'] | null

interface IMenuFilters {
  shop: Shop | null
  status: TStatusFilter
}

export type { IMenuFilters as MenuFilters, TStatusFilter as StatusFilter }
