import { toBoolean } from '../../../src/functions/utils';

// Test de la fonction toBoolean
describe('toBoolean', () => {
  test('toBoolean function convertit les chaînes en valeurs booléennes', () => {
    expect(toBoolean('true')).toBe(true);
    expect(toBoolean('false')).toBe(false);
    expect(toBoolean('random')).toBe(false);
    expect(toBoolean('')).toBe(false);
  });
});
