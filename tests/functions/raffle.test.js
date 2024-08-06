import { addPoints } from '../../functions/points.js';
import {
  begForRaffle,
  cancelRaffle,
  getRaffleParticipants,
  getRaffleStatus,
  joinRaffle,
  resetRaffleParticipants,
  resetRaffleStatus,
  startRaffle,
} from '../../functions/raffle.js';
import { checkRole, shuffleArray, sleep, toBoolean } from '../../functions/utils.js';
import { getLive } from '../../services/auth.js';

jest.mock('../../functions/utils.js');
jest.mock('../../functions/points.js');
jest.mock('../../services/auth.js');

describe('Raffle Functions', () => {
  let client;
  let tag;
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.POINTS_JSON = 'points.json';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    client = {
      say: jest.fn(),
    };
    process.env.CHANNEL = '#testChannel';
    process.env.RAFFLE_WIN_RATIO = 50;
    process.env.TIMER_RAFFLE = 1000; // Ajouter une valeur pour TIMER_RAFFLE
    process.env.LIVE_REQUIERED = 'false';
    process.env.RANDOM_RAFFLE_MIN = 10;
    process.env.RANDOM_RAFFLE_MAX = 20;
    process.env.RAFFLE_RATIO_MIN = 50;
    resetRaffleParticipants();
    resetRaffleStatus();
    global.numberRaffle = 0;
    jest.useFakeTimers();
    jest.clearAllMocks();
    resetRaffleParticipants();
    resetRaffleStatus();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Restaurer les vrais timers après chaque test
  });

  // Importation des modules nécessaires
  describe('startRaffle', () => {
    test('should not start a raffle if one is already in progress', async () => {
      resetRaffleStatus();
      await startRaffle(client, { mod: true }, 100);

      await startRaffle(client, { mod: true }, 100);
      expect(client.say).toHaveBeenCalled();
    });

    test('should not start a raffle if live is required and not live', async () => {
      const client = { say: jest.fn() };
      toBoolean.mockReturnValue(true);
      getLive.mockResolvedValue([]);

      await startRaffle(client, {}, '100');
      expect(client.say).not.toHaveBeenCalled();
    });

    test('should not start a raffle if user role is not allowed', async () => {
      toBoolean.mockReturnValue(false);
      checkRole.mockReturnValue(0);
      const client = { say: jest.fn() };

      await startRaffle(client, {}, '100');
      expect(client.say).not.toHaveBeenCalled();
    });

    test('should start a raffle and announce test', async () => {
      toBoolean.mockReturnValue(false);
      checkRole.mockReturnValue(1);
      sleep.mockResolvedValue();
      const client = { say: jest.fn() };

      await startRaffle(client, {}, '100');
      expect(client.say).toHaveBeenCalledWith(
        process.env.CHANNEL,
        'Un raffle de 100 est en cours! Tapez !join pour rejoindre!',
      );
    });

    test('should pick winners and announce them', async () => {
      const client = { say: jest.fn() };
      checkRole.mockReturnValue(1);
      sleep.mockResolvedValue();
      shuffleArray.mockImplementation((array) => array);
      addPoints.mockReturnValue([{ 'user-id': '2', username: 'User2' }]);
      getLive.mockReturnValue([{ started_at: '2023-08-04T19:51:56.773Z' }]);

      const message = '!raffle 100';

      startRaffle(client, tag, message);

      joinRaffle({ 'user-id': '1', username: 'User1' });
      joinRaffle({ 'user-id': '2', username: 'User2' });

      await sleep(1000);

      expect(client.say).toHaveBeenCalledWith('#testChannel', expect.stringContaining('Gagnant'));
      expect(addPoints).toHaveBeenCalledWith(expect.any(Array), expect.any(Number));
    });
  });

  describe('begForRaffle', () => {
    test('should start a raffle if conditions are met', async () => {
      checkRole.mockReturnValue(1);
      getLive.mockReturnValue([{ started_at: '2023-08-04T19:51:56.773Z' }]);

      await begForRaffle(client);

      joinRaffle({ 'user-id': '1', username: 'User1' });
      joinRaffle({ 'user-id': '2', username: 'User2' });

      expect(client.say).toHaveBeenCalled();
    });

    test('should not start a raffle if conditions are not met', async () => {
      getLive.mockResolvedValue([{ started_at: new Date().toISOString() }]);
      checkRole.mockReturnValue(1);
      global.numberRaffle = 100; // Simuler un grand nombre de raffles pour ne pas satisfaire les conditions

      await begForRaffle(client);

      expect(client.say).not.toHaveBeenCalled();
    });
  });

  describe('joinRaffle', () => {
    test('should add a user to raffle participants', () => {
      joinRaffle({ 'user-id': '1', username: 'User1' });
      expect(getRaffleParticipants()).toContainEqual({ id: '1', name: 'User1' });
    });

    test('should not add a user if already a participant', () => {
      const userTags = { 'user-id': '1', username: 'User1' };
      joinRaffle(userTags);
      joinRaffle(userTags);
      expect(getRaffleParticipants().length).toBe(1);
    });
  });

  describe('cancelRaffle', () => {
    test('should cancel an ongoing raffle if user role is allowed', () => {
      checkRole.mockReturnValue(1);
      const client = { say: jest.fn() };

      const result = cancelRaffle(client, {});
      expect(result).toBe(false);
      expect(client.say).toHaveBeenCalledWith(
        process.env.CHANNEL,
        'Le raffle a été annulé. PRANKEX',
      );
    });

    test('should not cancel a raffle if user role is not allowed', () => {
      const client = { say: jest.fn() };
      checkRole.mockReturnValue(0);

      const result = cancelRaffle(client, {});
      expect(result).toBeUndefined();
      expect(client.say).not.toHaveBeenCalled();
    });
  });

  describe('resetRaffleParticipants', () => {
    test('should reset the raffle participants', () => {
      joinRaffle({ 'user-id': '1', username: 'User1' });
      resetRaffleParticipants();
      expect(getRaffleParticipants()).toEqual([]);
    });
  });

  describe('resetRaffleStatus', () => {
    test('should reset the raffle status', () => {
      startRaffle();
      resetRaffleStatus();
      expect(getRaffleStatus()).toBe(false);
    });
  });

  describe('getRaffleParticipants', () => {
    test('should return the current raffle participants', () => {
      joinRaffle({ 'user-id': '1', username: 'User1' });
      expect(getRaffleParticipants()).toEqual([{ id: '1', name: 'User1' }]);
    });
  });

  describe('getRaffleStatus', () => {
    test('should return the current raffle status', () => {
      expect(getRaffleStatus()).toBe(false);
    });
  });
});
