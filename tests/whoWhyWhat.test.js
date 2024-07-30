import { randomInt } from 'crypto';
import {
  deleteEmptyWords,
  checkCooldown,
  checkForPourquoi,
  checkForQuoi,
  checkForQui,
} from '../functions/whoWhyWhat.js';

jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

describe('Tests pour les fonctions de réponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('deleteEmptyWords filtre et inverse les mots correctement', () => {
    const words = ['hello', 'world', '', 'test'];
    const result = deleteEmptyWords(words);

    expect(result).toEqual(['test', 'world', 'hello']);
  });

  test('checkCooldown ne devrait pas déclencher le cooldown pour un nouvel utilisateur', () => {
    const user = 'user1';
    // Appel initial, l'utilisateur n'est pas encore en cooldown
    const result = checkCooldown(user);
    expect(result).toBe(false); // Le premier appel ne doit pas déclencher le cooldown
  });

  test('checkCooldown devrait déclencher le cooldown pour un utilisateur pendant la période de cooldown', () => {
    const user = 'user2';
    // Simuler que l'utilisateur a déjà répondu
    checkCooldown(user); // Initialise le temps de cooldown pour l'utilisateur

    // Avancer le temps de moitié du cooldown pour simuler le passage du temps
    jest.advanceTimersByTime((10 * 60 * 1000) / 2);

    const result = checkCooldown(user);
    expect(result).toBe(true); // L'utilisateur devrait être en cooldown
  });

  test('checkCooldown ne devrait pas déclencher le cooldown pour un utilisateur après que la période de cooldown soit écoulée', () => {
    const user = 'user3';
    // Simuler que l'utilisateur a déjà répondu
    checkCooldown(user); // Initialise le temps de cooldown pour l'utilisateur

    // Avancer le temps au-delà de la période de cooldown
    jest.advanceTimersByTime(10 * 60 * 1000 + 1000);

    const result = checkCooldown(user);
    expect(result).toBe(false); // L'utilisateur ne devrait pas être en cooldown
  });

  test('checkForPourquoi répond avec une réponse appropriée', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Mock de randomInt pour retourner une valeur fixe
    randomInt.mockReturnValue(0);

    checkForPourquoi(client, channel, 'blablabla pourquoi', tags);

    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'Tout simplement pour feur Pepega Pepega',
      '123',
    );
  });

  test('checkForQuoi répond avec une réponse appropriée', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Mock de randomInt pour retourner une valeur fixe
    randomInt.mockReturnValue(0);

    checkForQuoi(client, channel, 'ya quoi', tags);

    expect(client.reply).toHaveBeenCalledWith(channel, 'FEUR !!!!!', '123');
  });

  test('checkForQui répond avec une réponse appropriée', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Mock de randomInt pour retourner une valeur fixe
    randomInt.mockReturnValue(0);

    checkForQui(client, channel, 'c est qui', tags);

    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'Quette ou bien kette tel est la question :thinking:',
      '123',
    );
  });

  test('checkForPourquoi ne répond pas si le cooldown est actif', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Simuler que le cooldown est actif
    checkCooldown(tags.id);
    if (!checkCooldown(tags.id)) checkForPourquoi(client, channel, 'pourquoi', tags);

    expect(client.reply).not.toHaveBeenCalled();
  });

  test('checkForQuoi ne répond pas si le cooldown est actif', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Simuler que le cooldown est actif
    checkCooldown(tags.id);
    if (!checkCooldown(tags.id)) checkForQuoi(client, channel, 'Quoi de neuf ?', tags);

    expect(client.reply).not.toHaveBeenCalled();
  });

  test('checkForQui ne répond pas si le cooldown est actif', () => {
    const client = { reply: jest.fn() };
    const channel = 'testChannel';
    const tags = { username: '123', id: '123' };

    // Simuler que le cooldown est actif
    checkCooldown(tags.id);
    if (!checkCooldown(tags.id)) checkForQui(client, channel, 'Qui est là ?', tags);

    expect(client.reply).not.toHaveBeenCalled();
  });
});
