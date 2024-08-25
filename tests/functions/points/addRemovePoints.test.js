// Import Package

// Import Services

// Import Fonctions
import {
  addPoints,
  getViewers,
  reassignViewers,
  removePoints,
  checkViewers,
} from '../../../src/functions/points';

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

  describe('addPoints', () => {
    test('should handle adding negative points', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      addPoints([{ id: '1' }], -30);

      expect(getViewers()['1'].points).toEqual(-30);
    });
  });

  describe('removePoints', () => {
    test('should handle removing negative points', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);
      addPoints([{ id: '1' }], 50);

      removePoints([{ id: '1' }], -20);

      expect(getViewers()['1'].points).toEqual(70); // Points totaux devraient être 50 + 20
    });
  });
});
