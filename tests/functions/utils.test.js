import { sleep, shuffleArray, checkRole } from '../../functions/utils.js';

describe('Fonctions Utils', () => {
  // Test de la fonction sleep
  test('sleep function attend un temps spécifié ', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  // Test de la fonction shuffleArray
  test('shuffleArray function randomize un array', () => {
    let array = [1, 2, 3, 4, 5];
    const originalArray = [...array];

    array = shuffleArray(array);

    // Check if the array is shuffled
    expect(array).not.toEqual(originalArray);
    // Check if the array has the same elements
    expect(array.toSorted((a, b) => a - b)).toEqual(originalArray);
  });

  // Test de la fonction checkRole
  test('checkRole function returne le role en fonction des tags', () => {
    const broadcasterTags = { badges: { broadcaster: 1 }, mod: false };
    const modTags = { badges: {}, mod: true };
    const viewerTags = { badges: {}, mod: false };

    expect(checkRole(broadcasterTags)).toBe(2);
    expect(checkRole(modTags)).toBe(1);
    expect(checkRole(viewerTags)).toBe(0);
  });
});
