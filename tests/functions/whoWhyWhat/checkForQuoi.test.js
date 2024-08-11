// Import Package
import { randomInt } from 'crypto';

// Import Fonctions
import { checkForQuoi, resetCooldowns } from '../../../src/functions/whoWhyWhat';

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

describe('checkForQuoi', () => {
  test('should reply with a random response if message ends with "quoi"', () => {
    const message = 'Quoi';
    const tags = { 'user-id': 1, id: 'msg-id' };
    randomInt.mockReturnValue(0);

    checkForQuoi(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledWith(channel, 'FEUR !!!!!', 'msg-id');
  });

  test('should not reply if user is in cooldown', () => {
    const message = 'Quoi';
    const tags = { 'user-id': 2, id: 'msg-id' };

    checkForQuoi(client, channel, message, tags);
    checkForQuoi(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledTimes(1);
  });
});
