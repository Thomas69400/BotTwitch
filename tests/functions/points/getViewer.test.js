// Import Fonctions
import { checkViewers, getViewer, reassignViewers } from '../../../src/functions/points';

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

  describe('getViewer', () => {
    test('should return the viewer by id', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      const viewer = getViewer('1');

      expect(viewer).toEqual({
        id: '1',
        name: 'John',
        points: 0,
        lastActive: expect.any(Date),
      });
    });

    test('should return undefined for non-existent viewer id', () => {
      const viewer = getViewer('999');
      expect(viewer).toBeUndefined();
    });
  });
});
