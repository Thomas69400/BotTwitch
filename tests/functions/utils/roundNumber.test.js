import { roundNumber } from '../../../src/functions/utils';

// Test de la fonction roundNumber
describe('roundNumber', () => {
  test('roundNumber function arrondit à la dizaine supérieure', () => {
    expect(roundNumber(5)).toBe(10);
    expect(roundNumber(10)).toBe(10);
    expect(roundNumber(15)).toBe(20);
    expect(roundNumber(0)).toBe(0);
  });
});
