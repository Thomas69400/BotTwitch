// Import Fonctions
import { getCooldownTime, resetCooldowns } from '../../../src/functions/whoWhyWhat';

// Mock de la fonction randomInt pour contrôler les réponses aléatoires
jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

let client, channel;
const COOLDOWN_TIME = 600000;

beforeEach(() => {
  client = {
    reply: jest.fn(),
  };
  channel = 'testChannel';
  resetCooldowns();
  jest.clearAllMocks();
});

describe('getCooldownTime', () => {
  test('should return the cooldown time', () => {
    expect(getCooldownTime()).toBe(600000);
  });
});
