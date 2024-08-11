// Import Package
import fs from 'fs';

// Import Fonctions
import { checkViewers, getViewers, readFile, reassignViewers } from '../../../src/functions/points';

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

  test('should update lastActive if viewer exists', async () => {
    const tags = { 'user-id': '1', username: 'John' };
    checkViewers(tags);
    const initialDate = getViewers()['1'].lastActive;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attendre 1 seconde

    checkViewers(tags);
    const updatedDate = getViewers()['1'].lastActive;

    expect(updatedDate).not.toEqual(initialDate);
  });

  describe('readFile', () => {
    test('should initialize viewers from JSON file', (done) => {
      const data = JSON.stringify({
        1: { id: '1', name: 'John', points: 10, lastActive: new Date().toISOString() },
      });
      fs.readFile.mockImplementation((path, encoding, callback) => {
        callback(null, data);
      });

      readFile();

      setImmediate(() => {
        const viewers = getViewers();
        expect(viewers).toEqual({
          1: {
            id: '1',
            name: 'John',
            points: 10,
            lastActive: expect.any(Date),
          },
        });
        expect(new Date(viewers['1'].lastActive)).toEqual(viewers['1'].lastActive);
        done();
      });
    });

    test('should handle file not found error', () => {
      fs.readFile.mockImplementation((path, encoding, callback) => {
        const err = new Error('File not found');
        err.code = 'ENOENT';
        callback(err);
      });

      console.log = jest.fn();

      readFile();

      expect(console.log).toHaveBeenCalledWith(
        'Aucun fichier de points trouvé, initialisation à un objet vide.',
      );
      expect(getViewers()).toEqual({});
    });

    test('should handle JSON parse error', () => {
      fs.readFile.mockImplementation((path, encoding, callback) => {
        callback(null, 'invalid JSON');
      });

      console.error = jest.fn();

      readFile();

      expect(console.error).toHaveBeenCalled();
      expect(console.error.mock.calls[0][0]).toEqual(
        expect.stringContaining("Erreur lors de l'analyse du fichier JSON:"),
      );
      expect(getViewers()).toEqual({});
    });

    test('should handle unexpected error', () => {
      fs.readFile.mockImplementation((path, encoding, callback) => {
        const err = new Error('Unexpected error');
        callback(err);
      });

      console.error = jest.fn();

      readFile();

      expect(console.error).toHaveBeenCalledWith(
        'Erreur lors du chargement des points:',
        new Error('Unexpected error'),
      );
    });
  });
});
