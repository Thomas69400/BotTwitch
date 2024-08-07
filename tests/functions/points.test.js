// Import Package
import fs from 'fs';

// Import Services
import { getLive } from '../../services/auth.js';

// Import Fonctions
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
  classement,
  points,
} from '../../functions/points.js';
import { toBoolean } from '../../functions/utils.js';

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
            lastActive: expect.any(String),
          },
        });
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

  describe('getIdViewerByName', () => {
    test('should return the viewer id by name', () => {
      const tags = { 'user-id': '1', username: 'John' };
      checkViewers(tags);

      const id = getIdViewerByName('John');

      expect(id).toEqual('1');
    });

    test('should return undefined for non-existent viewer name', () => {
      const id = getIdViewerByName('NonExistent');
      expect(id).toBeUndefined();
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

  describe('classement', () => {
    let client;

    beforeEach(() => {
      client = { say: jest.fn() };
      reassignViewers({
        1: { id: '1', name: 'John', points: 50, lastActive: new Date() },
        2: { id: '2', name: 'Doe', points: 100, lastActive: new Date() },
        3: { id: '3', name: 'Alice', points: 75, lastActive: new Date() },
      });
      process.env.POINT_NAME = 'points';
      process.env.CHANNEL = '#testChannel';
    });

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

  describe('points', () => {
    let client;
    const tags = { 'user-id': '1', username: 'John', id: 'msg-1' };

    beforeEach(() => {
      try {
        console.log('Running beforeEach');
        client = { reply: jest.fn() };
        reassignViewers({
          1: { id: '1', name: 'John', points: 50, lastActive: new Date() },
          2: { id: '2', name: 'Jane', points: 75, lastActive: new Date() },
        });
        process.env.POINT_NAME = 'points';
        process.env.CHANNEL = '#testChannel';
      } catch (error) {
        console.error('Error in beforeEach:', error);
      }
    });

    test('should send points of the user who asked', () => {
      console.log('Running test: should send points of the user who asked');
      const message = '!points';
      points(client, tags, message);
      expect(client.reply).toHaveBeenCalledWith(process.env.CHANNEL, 'Tu as 50 points !', 'msg-1');
    });

    test('should handle undefined viewer when asking for own points', () => {
      console.log('Running test: should handle undefined viewer when asking for own points');
      reassignViewers({});
      const message = '!points';
      points(client, tags, message);
      expect(client.reply).toHaveBeenCalledWith(
        process.env.CHANNEL,
        "Je n'ai pas trouvé tes points.",
        'msg-1',
      );
    });

    test('should send points of the specified user', () => {
      console.log('Running test: should send points of the specified user');
      const message = '!points Jane';
      points(client, tags, message);
      expect(client.reply).toHaveBeenCalledWith(process.env.CHANNEL, 'Jane a 75 points !', 'msg-1');
    });

    test("should handle undefined viewer when asking for another user's points", () => {
      console.log(
        "Running test: should handle undefined viewer when asking for another user's points",
      );
      const message = '!points NonExistentUser';
      points(client, tags, message);
      expect(client.reply).toHaveBeenCalledWith(
        process.env.CHANNEL,
        "Je n'ai pas trouvé de points pour l'utilisateur NonExistentUser.",
        'msg-1',
      );
    });
  });
});
