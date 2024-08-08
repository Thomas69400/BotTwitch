// Import Fonctions
import { reassignViewers, tellPoints } from '../../../src/functions/points';
import { clearMessage } from '../../../src/functions/utils';

jest.mock('../../../src/functions/utils');
jest.mock('../../../src/services/auth');

describe('tellPoints', () => {
  let client;
  const tags = { 'user-id': '1', username: 'John', id: 'msg-1' };
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.POINTS_JSON = 'points.test.json';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    reassignViewers(); // Réinitialiser les viewers
    client = { reply: jest.fn() };
    reassignViewers({
      1: { id: '1', name: 'John', points: 50, lastActive: new Date() },
      2: { id: '2', name: 'Jane', points: 75, lastActive: new Date() },
    });
    process.env.POINT_NAME = 'points';
    process.env.CHANNEL = '#testChannel';
  });

  test('should send points of the user who asked', () => {
    const message = '!points';
    tellPoints(client, tags, message);
    expect(client.reply).toHaveBeenCalledWith(process.env.CHANNEL, 'Tu as 50 points !', 'msg-1');
  });

  test('should handle undefined viewer when asking for own points', () => {
    reassignViewers({});
    const message = '!points';
    tellPoints(client, tags, message);
    expect(client.reply).toHaveBeenCalledWith(
      process.env.CHANNEL,
      "Je n'ai pas trouvé tes points.",
      'msg-1',
    );
  });

  test('should send points of the specified user', () => {
    const message = '!points \uD83D\uDE00 Jane \uD83D\uDE00';
    clearMessage.mockReturnValue('Jane');
    tellPoints(client, tags, message);
    expect(client.reply).toHaveBeenCalledWith(process.env.CHANNEL, 'Jane a 75 points !', 'msg-1');
  });

  test("should handle undefined viewer when asking for another user's points", () => {
    const message = '!points NonExistentUser';
    clearMessage.mockReturnValue('NonExistentUser');
    tellPoints(client, tags, message);
    expect(client.reply).toHaveBeenCalledWith(
      process.env.CHANNEL,
      "Je n'ai pas trouvé de points pour l'utilisateur NonExistentUser.",
      'msg-1',
    );
  });
});
