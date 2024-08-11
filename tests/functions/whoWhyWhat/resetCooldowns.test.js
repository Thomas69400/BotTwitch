// Import Fonctions
import { checkCooldown, resetCooldowns } from '../../../src/functions/whoWhyWhat';

// Mock de la fonction randomInt pour contrôler les réponses aléatoires
jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

let client, channel;

beforeEach(() => {
  client = {
    reply: jest.fn(),
  };
  channel = 'testChannel';
  resetCooldowns();
  jest.clearAllMocks();
});

describe('resetCooldowns', () => {
  test('should reset all cooldowns', () => {
    const userId = 1;
    checkCooldown(userId);
    resetCooldowns();
    expect(checkCooldown(userId)).toBe(false);
  });
});
