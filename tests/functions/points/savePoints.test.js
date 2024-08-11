// Import Package
import fs from 'fs';

// Import Fonctions
import {
  checkViewers,
  getViewers,
  reassignViewers,
  savePoints,
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

  describe('savePoints', () => {
    test('should save viewers to JSON file', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      savePoints();

      const viewers = getViewers();

      expect(fs.writeFile).toHaveBeenCalledWith(
        process.env.POINTS_JSON,
        JSON.stringify(viewers, null, 2),
        expect.any(Function),
      );
    });

    test('should handle save error', () => {
      fs.writeFile.mockImplementation((path, data, callback) => {
        callback(new Error('Save Error'));
      });

      console.error = jest.fn();

      savePoints();

      expect(console.error).toHaveBeenCalledWith(
        'Erreur lors de la sauvegarde des points:',
        new Error('Save Error'),
      );
    });
  });
});
