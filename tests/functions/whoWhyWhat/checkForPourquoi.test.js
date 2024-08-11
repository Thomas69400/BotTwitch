// Import Package
import { randomInt } from 'crypto';

// Import Fonctions
import { checkForPourquoi, resetCooldowns } from '../../../src/functions/whoWhyWhat';

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

describe('checkForPourquoi', () => {
  test('should reply with a random response if message ends with "pourquoi"', () => {
    const message = 'Pourquoi';
    const tags = { 'user-id': 1, id: 'msg-id' };
    randomInt.mockReturnValue(0);

    checkForPourquoi(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'Tout simplement pour feur Pepega Pepega',
      'msg-id',
    );
  });

  test('should not reply if user is in cooldown', () => {
    const message = 'Pourquoi';
    const tags = { 'user-id': 2, id: 'msg-id' };

    checkForPourquoi(client, channel, message, tags);
    checkForPourquoi(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledTimes(1);
  });
});
