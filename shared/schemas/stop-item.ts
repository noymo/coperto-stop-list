import { z } from 'zod'
import { isStopReason } from '#shared/constants/menu'
import { STOP_MAX_DURATION_MS, STOP_TIME_STEP_MS } from '#shared/constants/stop-list'
import type { StopReason } from '#shared/types/menu'

export const stopItemSchema = z
  .object({
    reason: z.custom<StopReason>(isStopReason, {
      message: 'Выберите причину стопа',
    }),
    until: z.string().nullable(),
  })
  .superRefine(({ until }, context) => {
    if (until === null) {
      return
    }

    const timestamp = Date.parse(until)
    const now = Date.now()

    if (Number.isNaN(timestamp)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Некорректное время',
      })

      return
    }

    if (timestamp <= now) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Время должно быть в будущем',
      })

      return
    }

    if (timestamp - now > STOP_MAX_DURATION_MS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Не больше чем на 24 часа вперёд',
      })

      return
    }

    if (timestamp % STOP_TIME_STEP_MS !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Шаг времени - 15 минут',
      })
    }
  })
