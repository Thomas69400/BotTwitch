// Import Package
import fs from 'fs';
import lockfile from 'proper-lockfile';

// Import Fonctions
import { savePoints, reassignViewers } from '../../../src/functions/points';

jest.mock('fs');
jest.mock('lockfile');

describe('savePoints', () => {
  const mockFilePath = '/path/to/file.json';

  beforeEach(() => {
    process.env.POINTS_JSON = mockFilePath;
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest.spyOn(lockfile, 'lock').mockResolvedValue(() => Promise.resolve());
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should save points to the file', async () => {
    const viewers = { user1: 10, user2: 20 };
    reassignViewers(viewers);

    await savePoints();

    expect(lockfile.lock).toHaveBeenCalledWith(mockFilePath);
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, JSON.stringify(viewers, null, 2));
  });

  test('should handle file saving errors', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('File error');
    });

    const viewers = { user1: 10, user2: 20 };
    reassignViewers(viewers);

    await savePoints();

    expect(console.error).toHaveBeenCalledWith(
      'Erreur lors de la sauvegarde des points:',
      expect.any(Error),
    );
  });

  test('should release the lock', async () => {
    const releaseLock = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(lockfile, 'lock').mockResolvedValue(releaseLock);

    const viewers = { user1: 10, user2: 20 };
    reassignViewers(viewers);

    await savePoints();

    expect(releaseLock).toHaveBeenCalled();
  });

  test('should handle errors while releasing the lock', async () => {
    const releaseLock = jest.fn().mockRejectedValue(new Error('Unlock error'));
    jest.spyOn(lockfile, 'lock').mockResolvedValue(releaseLock);

    const viewers = { user1: 10, user2: 20 };
    reassignViewers(viewers);

    await savePoints();

    expect(console.error).toHaveBeenCalledWith(
      'Erreur lors de la libération du verrou:',
      expect.any(Error),
    );
  });
});
