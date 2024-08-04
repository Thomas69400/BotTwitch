import { randomInt } from 'crypto';
import {
  deleteEmptyWords,
  checkCooldown,
  checkForPourquoi,
  checkForQuoi,
  checkForQui,
  resetCooldowns,
  getCooldownTime,
} from '../../functions/whoWhyWhat.js';

// Mock de la fonction randomInt pour contrôler les réponses aléatoires
jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

describe('whoWhyWhat function', () => {
  let client, channel, tags;
  const COOLDOWN_TIME = 600000;

  beforeEach(() => {
    client = {
      reply: jest.fn(),
    };
    channel = 'testChannel';
    resetCooldowns();
    jest.clearAllMocks();
  });
  describe('deleteEmptyWords', () => {
    test('should remove empty words and reverse the array', () => {
      const input = ['', 'hello', '', 'world', ''];
      const expectedOutput = ['world', 'hello'];
      expect(deleteEmptyWords(input)).toEqual(expectedOutput);
    });
  });

  describe('checkCooldown', () => {
    test('should return false and set cooldown for a user who is not in cooldown', () => {
      const userId = 1;
      expect(checkCooldown(userId)).toBe(false);
      expect(checkCooldown(userId)).toBe(true);
    });

    test('should return true if user is in cooldown', () => {
      const userId = 2;
      checkCooldown(userId);
      expect(checkCooldown(userId)).toBe(true);
    });

    test('should return false if cooldown has expired', () => {
      const userId = 3;
      checkCooldown(userId);
      jest.spyOn(Date, 'now').mockImplementation(() => new Date().getTime() + COOLDOWN_TIME + 1);
      expect(checkCooldown(userId)).toBe(false);
    });
  });

  describe('checkForPourquoi', () => {
    test('should reply with a random response if message ends with "pourquoi"', () => {
      const message = 'Pourquoi';
      const tags = { 'user-id': 1, id: 'msg-id' };
      randomInt.mockReturnValue(0);

      checkForPourquoi(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledWith(
        channel,
        'Tout simplement pour feur Pepega Pepega',
        'msg-id',
      );
    });

    test('should not reply if user is in cooldown', () => {
      const message = 'Pourquoi';
      const tags = { 'user-id': 2, id: 'msg-id' };

      checkForPourquoi(client, channel, message, tags);
      checkForPourquoi(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkForQuoi', () => {
    test('should reply with a random response if message ends with "quoi"', () => {
      const message = 'Quoi';
      const tags = { 'user-id': 1, id: 'msg-id' };
      randomInt.mockReturnValue(0);

      checkForQuoi(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledWith(channel, 'FEUR !!!!!', 'msg-id');
    });

    test('should not reply if user is in cooldown', () => {
      const message = 'Quoi';
      const tags = { 'user-id': 2, id: 'msg-id' };

      checkForQuoi(client, channel, message, tags);
      checkForQuoi(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkForQui', () => {
    test('should reply with a random response if message ends with "qui"', () => {
      const message = 'Qui';
      const tags = { 'user-id': 1, id: 'msg-id' };
      randomInt.mockReturnValue(0);

      checkForQui(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledWith(
        channel,
        'Quette ou bien kette tel est la question :thinking:',
        'msg-id',
      );
    });

    test('should not reply if user is in cooldown', () => {
      const message = 'Qui';
      const tags = { 'user-id': 2, id: 'msg-id' };

      checkForQui(client, channel, message, tags);
      checkForQui(client, channel, message, tags);
      expect(client.reply).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetCooldowns', () => {
    test('should reset all cooldowns', () => {
      const userId = 1;
      checkCooldown(userId);
      resetCooldowns();
      expect(checkCooldown(userId)).toBe(false);
    });
  });

  describe('getCooldownTime', () => {
    test('should return the cooldown time', () => {
      expect(getCooldownTime()).toBe(600000);
    });
  });
});
