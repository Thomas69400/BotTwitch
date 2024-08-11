import {
  begForRaffle,
  joinRaffle,
  resetRaffleParticipants,
  resetRaffleStatus,
} from '../../../src/functions/raffle';
import { checkRole } from '../../../src/functions/utils';
import { getLive } from '../../../src/services/auth';

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
});
