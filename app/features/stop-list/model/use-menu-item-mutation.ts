import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { MenuItem } from '#shared/types/menu'
import { useStopListUiStore } from '~/stores/stop-list-ui'
import { getApiErrorMessage } from '~/utils/api-error'
import type { MenuFilters } from './filters'
import type { Ref } from 'vue'
import { menuKeys } from './queries'

interface IBaseMutationVariables {
  id: string
}

interface IMutationContext {
  previousItems: MenuItem[] | undefined
  queryKey: ReturnType<typeof menuKeys.list>
}

interface IMenuItemMutationOptions<TVariables extends IBaseMutationVariables> {
  mutationFn: (variables: TVariables) => Promise<MenuItem>

  optimisticUpdate: (item: MenuItem, variables: TVariables) => MenuItem
}

export function useMenuItemMutation<TVariables extends IBaseMutationVariables>(
  filters: Ref<MenuFilters>,
  options: IMenuItemMutationOptions<TVariables>,
) {
  const queryClient = useQueryClient()
  const uiStore = useStopListUiStore()

  return useMutation<MenuItem, Error, TVariables, IMutationContext>({
    mutationFn: options.mutationFn,

    onMutate: async (variables) => {
      const queryKey = menuKeys.list(filters.value)

      await queryClient.cancelQueries({
        queryKey,
      })

      const previousItems = queryClient.getQueryData<MenuItem[]>(queryKey)

      queryClient.setQueryData<MenuItem[]>(queryKey, (items = []) =>
        items.map((item) => (item.id === variables.id ? options.optimisticUpdate(item, variables) : item)),
      )

      return {
        previousItems,
        queryKey,
      }
    },

    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(context.queryKey, context.previousItems)
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
