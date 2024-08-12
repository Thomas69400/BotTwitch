import { addPoints } from '../../../src/functions/points';
import {
  resetRaffleParticipants,
  resetRaffleStatus,
  startRaffle,
  setRaffleParticipants,
} from '../../../src/functions/raffle';
import { shuffleArray, sleep, liveAndRight } from '../../../src/functions/utils';

jest.mock('../../../src/functions/utils');
jest.mock('../../../src/functions/points');
jest.mock('../../../src/services/auth');

describe('Raffle Functions', () => {
  let client;
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
    process.env.TIMER_RAFFLE = 2000; // Ajouter une valeur pour TIMER_RAFFLE
    process.env.LIVE_REQUIERED = 'false';
    process.env.RANDOM_RAFFLE_MIN = 10;
    process.env.RANDOM_RAFFLE_MAX = 20;
    process.env.RAFFLE_RATIO_MIN = 50;
    resetRaffleParticipants();
    resetRaffleStatus();
    global.numberRaffle = 0;
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaurer les vrais timers après chaque test
  });

  // Importation des modules nécessaires
  describe('startRaffle', () => {
    test('should not start a raffle if one is already in progress', async () => {
      resetRaffleStatus();
      liveAndRight.mockReturnValue(true);
      await startRaffle(client, { mod: true }, 100);

      await startRaffle(client, { mod: true }, 100);
      expect(client.say).toHaveBeenCalled();
    });

    test('should not start a raffle if live is required and not live', async () => {
      liveAndRight.mockReturnValue(false);

      await startRaffle(client, {}, '100');
      expect(client.say).not.toHaveBeenCalled();
    });

    test('should not start a raffle if user role is not allowed', async () => {
      liveAndRight.mockReturnValue(false);

      await startRaffle(client, {}, '100');
      expect(client.say).not.toHaveBeenCalled();
    });

    test('should start a raffle and announce test', async () => {
      liveAndRight.mockReturnValue(true);
      sleep.mockResolvedValue();

      await startRaffle(client, {}, '100');
      expect(client.say).toHaveBeenCalledWith(
        process.env.CHANNEL,
        'Un raffle de 100 est en cours! Tapez !join pour rejoindre!',
      );
    });

    test('should pick winners and announce them', async () => {
      liveAndRight.mockReturnValue(true);
      sleep.mockResolvedValue();
      shuffleArray.mockImplementation((array) => array);
      addPoints.mockReturnValue([{ 'user-id': '2', username: 'User2' }]);
      setRaffleParticipants([
        { 'user-id': '1', username: 'User1' },
        { 'user-id': '2', username: 'User2' },
      ]);

      await startRaffle(
        client,
        {
          mod: true,
          'user-id': '3',
          username: 'startRaffle',
          id: '3',
        },
        '100',
      );

      await sleep(1000);

      expect(client.say).toHaveBeenCalledWith('#testChannel', expect.stringContaining('Gagnant'));
      expect(addPoints).toHaveBeenCalledWith(expect.any(Array), expect.any(Number));
    });
  });
});
