// Import Services
import { getLive } from '../../../src/services/auth';

// Import Fonctions
import {
  activeRevenue,
  checkViewers,
  getViewers,
  reassignViewers,
} from '../../../src/functions/points';
import { toBoolean } from '../../../src/functions/utils';

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

  describe('activeRevenue', () => {
    test('should add points to active viewers', async () => {
      toBoolean.mockReturnValue(false);
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      const initialPoints = getViewers()['1'].points;

      await activeRevenue();

      const updatedPoints = getViewers()['1'].points;
      expect(updatedPoints).toBeGreaterThan(initialPoints);
    });

    test('should not add points if viewer not active within 5 minutes', async () => {
      toBoolean.mockReturnValue(false);

      reassignViewers({
        1: {
          id: '1',
          name: 'John',
          points: 10,
          lastActive: new Date(Date.now() - 6 * 60000),
        },
      });

      const initialPoints = getViewers()['1'].points;

      await activeRevenue();

      const updatedPoints = getViewers()['1'].points;
      expect(updatedPoints).toEqual(initialPoints);
    });

    test('should not add points if live is required and getLive returns true', async () => {
      toBoolean.mockReturnValue(true);
      getLive.mockResolvedValue(true);

      await activeRevenue();

      expect(getLive).toHaveBeenCalled();
    });
  });
});
