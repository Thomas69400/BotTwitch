// Import Package
import { randomInt } from 'crypto';

// Import Fonctions
import { checkForQui, resetCooldowns } from '../../../src/functions/whoWhyWhat';

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

describe('checkForQui', () => {
  test('should reply with a random response if message ends with "qui"', () => {
    const message = 'Qui';
    const tags = { 'user-id': 1, id: 'msg-id' };
    randomInt.mockReturnValue(0);

    checkForQui(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'Quette ou bien kette tel est la question :thinking:',
      'msg-id',
    );
  });

  test('should not reply if user is in cooldown', () => {
    const message = 'Qui';
    const tags = { 'user-id': 2, id: 'msg-id' };

    checkForQui(client, channel, message, tags);
    checkForQui(client, channel, message, tags);
    expect(client.reply).toHaveBeenCalledTimes(1);
  });
});
