import { computed } from 'vue'
import { isMenuStatus, isShop } from '#shared/constants/menu'
import type { Shop } from '#shared/types/menu'
import type { MenuFilters, StatusFilter } from './filters'
import { useRoute, useRouter } from '#app'

export function useMenuFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<MenuFilters>(() => ({
    shop: isShop(route.query.shop) ? route.query.shop : null,
    status: isMenuStatus(route.query.status) ? route.query.status : null,
  }))

  async function setShop(shop: Shop | null): Promise<void> {
    const query = {
      ...route.query,
    }

    if (shop === null) {
      delete query.shop
    } else {
      query.shop = shop
    }

    await router.push({ query })
  }

  async function setStatus(status: StatusFilter): Promise<void> {
    const query = {
      ...route.query,
    }

    if (status === null) {
      delete query.status
    } else {
      query.status = status
    }

    await router.push({ query })
  }

  return {
    filters,
    setShop,
    setStatus,
  }
}
