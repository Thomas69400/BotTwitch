import {
  sleep,
  shuffleArray,
  checkRole,
  roundNumber,
  toBoolean,
  clearMessage,
  commandes,
} from '../../functions/utils.js';

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

describe('Fonctions Utils', () => {
  // Test de la fonction sleep
  test('sleep function attend un temps spécifié', async () => {
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

  // Test de la fonction roundNumber
  test('roundNumber function arrondit à la dizaine supérieure', () => {
    expect(roundNumber(5)).toBe(10);
    expect(roundNumber(10)).toBe(10);
    expect(roundNumber(15)).toBe(20);
    expect(roundNumber(0)).toBe(0);
  });

  // Test de la fonction toBoolean
  test('toBoolean function convertit les chaînes en valeurs booléennes', () => {
    expect(toBoolean('true')).toBe(true);
    expect(toBoolean('false')).toBe(false);
    expect(toBoolean('random')).toBe(false);
    expect(toBoolean('')).toBe(false);
  });

  // Test de la fonction clearMessage
  test('clearMessage function nettoie le message correctement', () => {
    const message = '  Hello   \uD83D\uDE00 World  ';
    const cleanedMessage = clearMessage(message);
    expect(cleanedMessage).toBe('Hello World');
  });

  // Test de la fonction commandes
  test('commandes function retourne les bonnes instructions pour chaque commande', () => {
    process.env.CHANNEL = 'testChannel';
    process.env.TIMEOUT_BASE_COST = '100';

    expect(commandes('timeout')).toBe(
      `!timeout pseudo durée(minutes) ex: !timeout ${process.env.CHANNEL} 1 --> prix : ${process.env.TIMEOUT_BASE_COST}`,
    );
    expect(commandes('vip')).toBe(`!vip pseudo ex: !vip ${process.env.CHANNEL}`);
    expect(commandes()).toBe('Commandes disponible: !timeout ; !points ; !classement');
  });
});
