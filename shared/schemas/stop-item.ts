import { z } from 'zod';
import { STOP_REASONS } from '#shared/types/menu';

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

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
      return;
    }

    const timestamp = Date.parse(until);
    const now = Date.now();

    if (Number.isNaN(timestamp)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Некорректное время',
      });

      return;
    }

    if (timestamp <= now) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Время должно быть в будущем',
      });

      return;
    }

    if (timestamp - now > MAX_AHEAD_MS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Не больше чем на 24 часа вперёд',
      });

      return;
    }

    if (timestamp % STEP_MS !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['until'],
        message: 'Шаг времени — 15 минут',
      });
    }
  });
