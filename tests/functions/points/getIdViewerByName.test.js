// Import Fonctions
import { checkViewers, getIdViewerByName, reassignViewers } from '../../../src/functions/points';

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

  // Exemple pour getIdViewerByName
  describe('getIdViewerByName edge cases', () => {
    test('should return undefined for a non-existent viewer name', () => {
      const id = getIdViewerByName('NonExistentName');
      expect(id).toBeUndefined();
    });

    test('should return the correct viewer id by name', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);
      const id = getIdViewerByName('John');
      expect(id).toEqual('1');
    });
  });
});
