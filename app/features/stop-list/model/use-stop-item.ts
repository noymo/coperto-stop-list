import { useMutation, useQueryClient } from '@tanstack/vue-query';

import type { MenuItem, StopItemPayload } from '#shared/types/menu';

import type { MenuFilters } from './filters';
import { menuKeys } from './queries';
import { getApiErrorMessage } from '~/utils/api-error';

interface StopItemVariables {
  id: string;
  payload: StopItemPayload;
}

interface StopMutationContext {
  previousItems: MenuItem[] | undefined;
  queryKey: ReturnType<typeof menuKeys.list>;
}

export function useStopItem(filters: Ref<MenuFilters>) {
  const queryClient = useQueryClient();
  const uiStore = useStopListUiStore();

  return useMutation<MenuItem, Error, StopItemVariables, StopMutationContext>({
    mutationFn: ({ id, payload }) => {
      return $fetch<MenuItem>(`/api/menu-items/${id}/stop`, {
        method: 'POST',
        body: payload,
      });
    },

    onMutate: async ({ id, payload }) => {
      const queryKey = menuKeys.list(filters.value);

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousItems = queryClient.getQueryData<MenuItem[]>(queryKey);

      queryClient.setQueryData<MenuItem[]>(queryKey, (items = []) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: {
                  kind: 'stopped',
                  reason: payload.reason,
                  until: payload.until,
                },
              }
            : item,
        ),
      );

      return {
        previousItems,
        queryKey,
      };
    },

    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(context.queryKey, context.previousItems);
      }

      uiStore.showToast(getApiErrorMessage(error), 'error');
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: menuKeys.all,
      });
    },
  });
}
