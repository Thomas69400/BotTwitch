import fs from 'fs';
import {
  activeRevenue,
  addPoints,
  checkViewers,
  getIdViewerByName,
  getViewer,
  getViewers,
  readFile,
  reassignViewers,
  removePoints,
  savePoints,
} from '../../functions/points.js';
import { toBoolean } from '../../functions/utils.js';

// Mock fs functions
jest.mock('fs');
jest.mock('../../functions/utils.js');
jest.mock('../../services/auth');

describe('Points Service', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.POINTS_JSON = 'points.json';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    reassignViewers();
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
            lastActive: expect.any(String), // Vérifie que c'est une chaîne de caractères
          },
        });

        // Vérifie que la chaîne de caractères est bien une date au format ISO 8601
        expect(new Date(viewers['1'].lastActive).toISOString()).toEqual(viewers['1'].lastActive);
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
      }, 1000); // Délai de 1 seconde pour s'assurer que la date change
    });
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

      // Manually update lastActive to be more than 5 minutes ago
      reassignViewers({
        1: {
          'user-id': '1',
          username: 'John',
          points: '10',
          lastActive: new Date(Date.now() - 6 * 60000),
        },
      });

      const initialPoints = getViewers()['1'].points;

      await activeRevenue();

      const updatedPoints = getViewers()['1'].points;
      expect(updatedPoints).toEqual(initialPoints);
    });
  });

  describe('addPoints', () => {
    test('should add points to specified viewers', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      addPoints([{ id: '1' }], 50);

      expect(getViewers()['1'].points).toEqual(50);
    });
  });

  describe('removePoints', () => {
    test('should remove points from specified viewers', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      addPoints([{ id: '1' }], 50);
      removePoints([{ id: '1' }], 20);

      expect(getViewers()['1'].points).toEqual(30);
    });
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
  });

  describe('getIdViewerByName', () => {
    test('should return the viewer id by name', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      const id = getIdViewerByName('John');

      expect(id).toEqual('1');
    });
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
  });
});
