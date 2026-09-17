import { createError } from 'h3'
import { MENU_ITEM_MUTATION_DELAY_MS, MENU_ITEM_MUTATION_FAILURE_RATE } from '#shared/constants/stop-list'

export async function simulateMutation(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MENU_ITEM_MUTATION_DELAY_MS)
  })

  if (Math.random() < MENU_ITEM_MUTATION_FAILURE_RATE) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось сохранить изменение. Попробуйте ещё раз.',
    })
  }
}
