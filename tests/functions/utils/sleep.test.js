import { sleep } from '../../../src/functions/utils';

describe('sleep', () => {
  // Test de la fonction sleep
  test('sleep function attend un temps spécifié', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
