import type { MenuItem } from '#shared/types/menu'
import type { MenuFilters } from './filters'
import type { Ref } from 'vue'
import { useMenuItemMutation } from './use-menu-item-mutation'

interface IResumeItemVariables {
  id: string
}

export type { IResumeItemVariables as ResumeItemVariables }

export function useResumeItem(filters: Ref<MenuFilters>) {
  return useMenuItemMutation<IResumeItemVariables>(filters, {
    mutationFn: ({ id }) =>
      $fetch<MenuItem>(`/api/menu-items/${id}/resume`, {
        method: 'POST',
      }),

    optimisticUpdate: (item) => ({
      ...item,

      status: {
        kind: 'available',
      },
    }),
  })
}
