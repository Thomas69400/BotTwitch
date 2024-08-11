import {
  cancelRaffle,
  resetRaffleParticipants,
  resetRaffleStatus,
} from '../../../src/functions/raffle';
import { checkRole } from '../../../src/functions/utils';

jest.mock('../../../src/functions/utils');
jest.mock('../../../src/functions/points');
jest.mock('../../../src/services/auth');

describe('Raffle Functions', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.POINTS_JSON = 'points.json';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
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
});
