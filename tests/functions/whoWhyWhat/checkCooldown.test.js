// Import Fonctions
import { checkCooldown, resetCooldowns } from '../../../src/functions/whoWhyWhat';

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

describe('checkCooldown', () => {
  test('should return false and set cooldown for a user who is not in cooldown', () => {
    const userId = 1;
    expect(checkCooldown(userId)).toBe(false);
    expect(checkCooldown(userId)).toBe(true);
  });

  test('should return true if user is in cooldown', () => {
    const userId = 2;
    checkCooldown(userId);
    expect(checkCooldown(userId)).toBe(true);
  });

  test('should return false if cooldown has expired', () => {
    const userId = '3';
    checkCooldown(userId);
    const originalDate = Date;
    const mockDate = new Date(originalDate.now() + COOLDOWN_TIME + 1);
    global.Date = jest.fn(() => mockDate);
    global.Date.now = jest.fn(() => mockDate.getTime());
    expect(checkCooldown(userId)).toBe(false);
    global.Date = originalDate;
  });
});
