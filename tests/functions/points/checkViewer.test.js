// Import Fonctions
import { checkViewers, getViewers, reassignViewers } from '../../../src/functions/points';

jest.mock('fs');
jest.mock('../../../src/functions/utils');
jest.mock('../../../src/services/auth');

describe('Points Service', () => {
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
  });

  describe('checkViewers', () => {
    test('should add a new viewer if not exists', () => {
      const tags = { 'user-id': '1', username: 'John' };

      checkViewers(tags);

      expect(getViewers()).toEqual({
        1: {
          id: '1',
          name: 'John',
          points: 0,
          lastActive: expect.any(Date),
        },
      });
    });

    test('should update lastActive if viewer exists', (done) => {
      const tags = { 'user-id': '1', username: 'John' };

      checkViewers(tags);
      const initialDate = getViewers()['1'].lastActive;

      setTimeout(() => {
        checkViewers(tags);
        const updatedDate = getViewers()['1'].lastActive;

        expect(updatedDate).not.toEqual(initialDate);
        done();
      }, 1000);
    });
  });
});
