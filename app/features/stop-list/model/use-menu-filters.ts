import type { Shop } from '#shared/types/menu';
import type { MenuFilters, StatusFilter } from './filters';

const shops: Shop[] = ['kitchen', 'bar', 'pastry'];

const statuses: Exclude<StatusFilter, null>[] = ['available', 'stopped'];

function isShop(value: unknown): value is Shop {
  return typeof value === 'string' && shops.some((shop) => shop === value);
}

function isStatus(value: unknown): value is Exclude<StatusFilter, null> {
  return (
    typeof value === 'string' && statuses.some((status) => status === value)
  );
}

export function useMenuFilters() {
  const route = useRoute();
  const router = useRouter();

  const filters = computed<MenuFilters>(() => ({
    shop: isShop(route.query.shop) ? route.query.shop : null,

    status: isStatus(route.query.status) ? route.query.status : null,
  }));

  async function setShop(shop: Shop | null) {
    const query = {
      ...route.query,
    };

    if (shop === null) {
      delete query.shop;
    } else {
      query.shop = shop;
    }

    await router.push({
      query,
    });
  }

  async function setStatus(status: StatusFilter) {
    const query = {
      ...route.query,
    };

    if (status === null) {
      delete query.status;
    } else {
      query.status = status;
    }

    await router.push({
      query,
    });
  }

  return {
    filters,
    setShop,
    setStatus,
  };
}
