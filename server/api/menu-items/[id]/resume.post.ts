import { createError, defineEventHandler, getRouterParam } from 'h3'
import { getMenuItem, resumeMenuItem } from '#server/utils/menu-store'
import { simulateMutation } from '#server/utils/simulate-mutation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не передан id позиции',
    })
  }

  const currentItem = getMenuItem(id)

  if (!currentItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Позиция не найдена',
    })
  }

  if (currentItem.stock === 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Нельзя вернуть позицию в продажу при нулевом остатке',
    })
  }

  await simulateMutation()

  const updatedItem = resumeMenuItem(id)

  if (!updatedItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Позиция не найдена',
    })
  }

  return updatedItem
})
