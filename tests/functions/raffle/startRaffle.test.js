import { addPoints } from '../../../src/functions/points';
import {
  joinRaffle,
  resetRaffleParticipants,
  resetRaffleStatus,
  startRaffle,
} from '../../../src/functions/raffle';
import { checkRole, shuffleArray, sleep, toBoolean } from '../../../src/functions/utils';
import { getLive } from '../../../src/services/auth';

jest.mock('../../../src/functions/utils');
jest.mock('../../../src/functions/points');
jest.mock('../../../src/services/auth');

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
});
