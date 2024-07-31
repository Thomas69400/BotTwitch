import fs from 'fs';
import {
  checkViewers,
  activeRevenue,
  addPoints,
  savePoints,
  getViewers,
  resetViewers,
} from '../functions/points'; // Assurez-vous que le chemin est correct
import { sleep } from '../functions/utils';

jest.mock('fs'); // Mock fs

describe('Tests pour les fonctions de points', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
    resetViewers();
  });
  test("checkViewers ajoute un nouveau viewer s'il n'existe pas", () => {
    const tags = { 'user-id': '123', username: 'JohnDoe' };
    checkViewers(tags);

    const viewers = getViewers();

    expect(viewers['123']).toBeDefined();
    expect(viewers['123'].name).toBe('JohnDoe');
    expect(viewers['123'].points).toBe(0);
    expect(viewers['123'].lastActive).toBeInstanceOf(Date);
  });

  test("checkViewers met à jour la date de dernière activité d'un viewer existant", async () => {
    const tags = { 'user-id': '456', username: 'JohnDoe' };

    checkViewers(tags);
    const oldViewers = JSON.parse(JSON.stringify(getViewers()));

    await sleep(1000);

    checkViewers(tags);
    const newViewers = JSON.parse(JSON.stringify(getViewers()));

    expect(oldViewers['456'].lastActive).not.toBe(newViewers['456'].lastActive);
  });

  test('activeRevenue ajoute des points aux viewers actifs', () => {
    const viewers = getViewers();
    const tags = { 'user-id': '456', username: 'JohnDoe' };
    const tags2 = { 'user-id': '123', username: 'JohnDoe' };
    checkViewers(tags);
    checkViewers(tags2);

    activeRevenue();

    expect(viewers['123'].points).toBe(10);
    expect(viewers['456'].points).toBe(10);
  });

  test('addPoints ajoute des points aux viewers spécifiés', () => {
    const viewers = getViewers();
    const tags = { 'user-id': '456', username: 'JohnDoe' };
    const tags2 = { 'user-id': '123', username: 'JohnDoe' };

    checkViewers(tags);
    checkViewers(tags2);

    addPoints(
      [
        { id: '123', name: 'test1' },
        { id: '456', name: 'test2' },
      ],
      10,
    );

    expect(viewers['123'].points).toBe(10);
    expect(viewers['456'].points).toBe(10);
  });

  test('savePoints appelle fs.writeFile avec les bons arguments', () => {
    fs.writeFile.mockImplementation((path, undefined, callback) => callback(null)); // Mock successful write

    const viewers = getViewers();

    savePoints();

    expect(fs.writeFile).toHaveBeenCalledWith(
      'points.json',
      JSON.stringify(viewers, null, 2),
      expect.any(Function),
    );
  });
});
