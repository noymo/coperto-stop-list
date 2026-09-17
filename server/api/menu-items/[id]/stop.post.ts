import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { getMenuItem, stopMenuItem } from '#server/utils/menu-store'
import { simulateMutation } from '#server/utils/simulate-mutation'
import { stopItemSchema } from '#shared/schemas/stop-item'

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

  const body = await readBody<unknown>(event)

  const result = stopItemSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректные данные формы',
      data: {
        fieldErrors: result.error.flatten().fieldErrors,
      },
    })
  }

  await simulateMutation()

  const updatedItem = stopMenuItem(id, result.data)

  if (!updatedItem) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Позиция не найдена',
    })
  }

  return updatedItem
})
