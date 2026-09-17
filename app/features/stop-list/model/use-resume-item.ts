import { useMutation, useQueryClient } from '@tanstack/vue-query';

import type { MenuItem } from '#shared/types/menu';

import type { MenuFilters } from './filters';
import { menuKeys } from './queries';
import { getApiErrorMessage } from '~/utils/api-error';

interface ResumeMutationContext {
  previousItems: MenuItem[] | undefined;
  queryKey: ReturnType<typeof menuKeys.list>;
}

export function useResumeItem(filters: Ref<MenuFilters>) {
  const queryClient = useQueryClient();
  const uiStore = useStopListUiStore();

  return useMutation<MenuItem, Error, string, ResumeMutationContext>({
    mutationFn: (id) => {
      return $fetch<MenuItem>(`/api/menu-items/${id}/resume`, {
        method: 'POST',
      });
    },

    onMutate: async (id) => {
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
                  kind: 'available',
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

    onError: (error, _id, context) => {
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
