import { useQuery } from '@tanstack/vue-query'
import type { MenuItem } from '#shared/types/menu'
import type { MenuFilters } from './filters'

export const menuKeys = {
  all: ['menu-items'] as const,

  list: (filters: MenuFilters) => [...menuKeys.all, filters] as const,
}

export function useMenuItems(filters: Ref<MenuFilters>) {
  return useQuery({
    queryKey: computed(() => menuKeys.list(filters.value)),

    queryFn: () => {
      return $fetch<MenuItem[]>('/api/menu-items', {
        query: {
          shop: filters.value.shop ?? undefined,
          status: filters.value.status ?? undefined,
        },
      })
    },
  })
}
