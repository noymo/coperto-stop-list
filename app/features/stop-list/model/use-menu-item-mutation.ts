import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { MenuItem } from '#shared/types/menu'
import { useStopListUiStore } from '~/stores/stop-list-ui'
import { getApiErrorMessage } from '~/utils/api-error'
import type { MenuFilters } from './filters'
import type { Ref } from 'vue'
import { menuKeys } from './queries'

interface BaseMutationVariables {
  id: string
}

interface MutationContext {
  previousItem: MenuItem | undefined
  previousIndex: number
  queryKey: ReturnType<typeof menuKeys.list>
}

interface MenuItemMutationOptions<TVariables extends BaseMutationVariables> {
  mutationFn: (variables: TVariables) => Promise<MenuItem>
  optimisticUpdate: (item: MenuItem, variables: TVariables) => MenuItem
}

function matchesFilters(item: MenuItem, filters: MenuFilters): boolean {
  if (filters.shop !== null && item.shop !== filters.shop) {
    return false
  }

  if (filters.status !== null && item.status.kind !== filters.status) {
    return false
  }

  return true
}

export function useMenuItemMutation<TVariables extends BaseMutationVariables>(
  filters: Ref<MenuFilters>,
  options: MenuItemMutationOptions<TVariables>,
) {
  const queryClient = useQueryClient()
  const uiStore = useStopListUiStore()

  return useMutation<MenuItem, Error, TVariables, MutationContext>({
    mutationFn: options.mutationFn,

    onMutate: async (variables) => {
      const currentFilters = { ...filters.value }
      const queryKey = menuKeys.list(currentFilters)

      await queryClient.cancelQueries({
        queryKey,
      })

      const items = queryClient.getQueryData<MenuItem[]>(queryKey) ?? []
      const previousIndex = items.findIndex((item) => item.id === variables.id)
      const previousItem = previousIndex >= 0 ? items[previousIndex] : undefined

      queryClient.setQueryData<MenuItem[]>(queryKey, (currentItems = []) => {
        return currentItems.flatMap((item) => {
          if (item.id !== variables.id) {
            return [item]
          }

          const updatedItem = options.optimisticUpdate(item, variables)

          return matchesFilters(updatedItem, currentFilters) ? [updatedItem] : []
        })
      })

      return {
        previousItem,
        previousIndex,
        queryKey,
      }
    },

    onError: (error, _variables, context) => {
      const previousItem = context?.previousItem

      if (context && previousItem) {
        queryClient.setQueryData<MenuItem[]>(context.queryKey, (items = []) => {
          const restoredItems = items.filter((item) => item.id !== previousItem.id)
          const insertIndex = Math.min(Math.max(context.previousIndex, 0), restoredItems.length)

          restoredItems.splice(insertIndex, 0, previousItem)

          return restoredItems
        })
      }

      uiStore.showToast(getApiErrorMessage(error), 'error')
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: menuKeys.all,
      })
    },
  })
}
