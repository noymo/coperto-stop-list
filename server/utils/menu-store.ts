import type { MenuItem, StopItemPayload } from '#shared/types/menu'

const now = new Date().toISOString()

const inOneHour = new Date(Date.now() + 60 * 60 * 1000).toISOString()

const inTwoHours = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

const menuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Бургер с говядиной',
    shop: 'kitchen',
    stock: 12,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '2',
    title: 'Паста Карбонара',
    shop: 'kitchen',
    stock: 8,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '3',
    title: 'Стейк из говядины',
    shop: 'kitchen',
    stock: 4,
    status: {
      kind: 'stopped',
      reason: 'equipment',
      until: null,
    },
    updatedAt: now,
  },
  {
    id: '4',
    title: 'Салат Цезарь',
    shop: 'kitchen',
    stock: 15,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '5',
    title: 'Домашний лимонад',
    shop: 'bar',
    stock: 20,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '6',
    title: 'Апельсиновый фреш',
    shop: 'bar',
    stock: 6,
    status: {
      kind: 'stopped',
      reason: 'quality',
      until: inOneHour,
    },
    updatedAt: now,
  },
  {
    id: '7',
    title: 'Капучино',
    shop: 'bar',
    stock: 30,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '8',
    title: 'Матча латте',
    shop: 'bar',
    stock: 11,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '9',
    title: 'Чизкейк',
    shop: 'pastry',
    stock: 0,
    status: {
      kind: 'stopped',
      reason: 'out_of_stock',
      until: null,
    },
    updatedAt: now,
  },
  {
    id: '10',
    title: 'Тирамису',
    shop: 'pastry',
    stock: 5,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
  {
    id: '11',
    title: 'Медовик',
    shop: 'pastry',
    stock: 7,
    status: {
      kind: 'stopped',
      reason: 'menu_change',
      until: inTwoHours,
    },
    updatedAt: now,
  },
  {
    id: '12',
    title: 'Шоколадный фондан',
    shop: 'pastry',
    stock: 9,
    status: {
      kind: 'available',
    },
    updatedAt: now,
  },
]

export function getMenuItems(): MenuItem[] {
  return menuItems.map((item) => ({
    ...item,
    status: {
      ...item.status,
    },
  }))
}

function cloneMenuItem(item: MenuItem): MenuItem {
  return {
    ...item,
    status: {
      ...item.status,
    },
  }
}

export function getMenuItem(id: string): MenuItem | undefined {
  const item = menuItems.find((menuItem) => menuItem.id === id)

  return item ? cloneMenuItem(item) : undefined
}

export function stopMenuItem(id: string, payload: StopItemPayload): MenuItem | undefined {
  const item = menuItems.find((menuItem) => menuItem.id === id)

  if (!item) {
    return undefined
  }

  item.status = {
    kind: 'stopped',
    reason: payload.reason,
    until: payload.until,
  }

  item.updatedAt = new Date().toISOString()

  return cloneMenuItem(item)
}

export function resumeMenuItem(id: string): MenuItem | undefined {
  const item = menuItems.find((menuItem) => menuItem.id === id)

  if (!item) {
    return undefined
  }

  item.status = {
    kind: 'available',
  }

  item.updatedAt = new Date().toISOString()

  return cloneMenuItem(item)
}
