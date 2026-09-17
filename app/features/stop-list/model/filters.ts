import type { MenuItemStatus, Shop } from '#shared/types/menu';

export type StatusFilter = MenuItemStatus['kind'] | null;

export interface MenuFilters {
  shop: Shop | null;
  status: StatusFilter;
}
