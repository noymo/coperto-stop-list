import type { MenuItem, StopItemPayload } from '#shared/types/menu'
import type { MenuFilters } from './filters'
import type { Ref } from 'vue'
import { useMenuItemMutation } from './use-menu-item-mutation'

interface IStopItemVariables {
  id: string
  payload: StopItemPayload
}

export type { IStopItemVariables as StopItemVariables }

export function useStopItem(filters: Ref<MenuFilters>) {
  return useMenuItemMutation<IStopItemVariables>(filters, {
    mutationFn: ({ id, payload }) =>
      $fetch<MenuItem>(`/api/menu-items/${id}/stop`, {
        method: 'POST',
        body: payload,
      }),

    optimisticUpdate: (item, { payload }) => ({
      ...item,

      status: {
        kind: 'stopped',
        reason: payload.reason,
        until: payload.until,
      },
    }),
  })
}
