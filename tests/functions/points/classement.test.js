// Import Fonctions
import { classement, reassignViewers } from '../../../src/functions/points';

jest.mock('fs');
jest.mock('../../../src/functions/utils');
jest.mock('../../../src/services/auth');

describe('Points Service', () => {
  let originalEnv;
  let client;

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
    client = { say: jest.fn() };
    reassignViewers({
      1: { id: '1', name: 'John', points: 50, lastActive: new Date() },
      2: { id: '2', name: 'Doe', points: 100, lastActive: new Date() },
      3: { id: '3', name: 'Alice', points: 75, lastActive: new Date() },
    });
    process.env.POINT_NAME = 'points';
    process.env.CHANNEL = '#testChannel';
  });

  describe('classement', () => {
    test('should send top 3 viewers to chat', () => {
      classement(client);
      expect(client.say).toHaveBeenCalledWith(
        process.env.CHANNEL,
        '#1 Doe 100 points ; #2 Alice 75 points ; #3 John 50 points',
      );
    });

    test('should handle less than 10 viewers', () => {
      reassignViewers({
        1: { id: '1', name: 'John', points: 50, lastActive: new Date() },
      });
      classement(client);
      expect(client.say).toHaveBeenCalledWith(process.env.CHANNEL, '#1 John 50 points');
    });

    test('should handle no viewers', () => {
      reassignViewers({});
      classement(client);
      expect(client.say).toHaveBeenCalledWith(process.env.CHANNEL, '');
    });
  });
});
