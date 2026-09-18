import { MENU_ITEMS_GET_DELAY_MS } from '#shared/constants/stop-list'
import type { MenuItem } from '#shared/types/menu'
import { getMenuItems } from '#server/utils/menu-store'

export default defineEventHandler(async (event): Promise<MenuItem[]> => {
  await new Promise((resolve) => {
    setTimeout(resolve, MENU_ITEMS_GET_DELAY_MS)
  })

  const query = getQuery(event)

  const shop = typeof query.shop === 'string' ? query.shop : null

  const status = typeof query.status === 'string' ? query.status : null

  return getMenuItems().filter((item) => {
    const matchesShop = shop === null || item.shop === shop

    const matchesStatus = status === null || item.status.kind === status

    return matchesShop && matchesStatus
  })
})
