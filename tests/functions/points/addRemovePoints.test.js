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

  describe('addPoints and removePoints edge cases', () => {
    test('should handle adding points to viewers who don’t exist', () => {
      addPoints([{ id: 'non-existent-id' }], 50);
      const viewer = getViewers()['non-existent-id'];
      expect(viewer).toBeDefined();
      expect(viewer.points).toEqual(50);
    });

    test('should handle removing points to viewers who don’t exist', () => {
      removePoints([{ id: 'non-existent-id' }], 50);
      const viewer = getViewers()['non-existent-id'];
      expect(viewer).toBeDefined();
      expect(viewer.points).toEqual(-50);
    });
  });
});
