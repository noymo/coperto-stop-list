import { z } from 'zod'
import { STOP_MAX_DURATION_HOURS, STOP_MAX_DURATION_MS, STOP_TIME_STEP_MINUTES } from '#shared/constants/stop-list'
import { STOP_REASONS } from '#shared/types/menu'

export const stopItemSchema = z
  .object({
    reason: z.enum(STOP_REASONS, {
      errorMap: () => ({
        message: 'Выберите причину стопа',
      }),
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
        message: `Не больше чем на ${STOP_MAX_DURATION_HOURS} часа вперёд`,
      })

      return
    }

    const date = new Date(timestamp)

    if (date.getMinutes() % STOP_TIME_STEP_MINUTES !== 0 || date.getSeconds() !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: `Шаг времени — ${STOP_TIME_STEP_MINUTES} минут`,
      })
    }
  })
