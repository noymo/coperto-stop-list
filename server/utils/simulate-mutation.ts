import { createError } from 'h3';

const MUTATION_DELAY_MS = 600;
const FAILURE_RATE = 0.2;

export async function simulateMutation(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MUTATION_DELAY_MS);
  });

  if (Math.random() < FAILURE_RATE) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось сохранить изменение. Попробуйте ещё раз.',
    });
  }
}
