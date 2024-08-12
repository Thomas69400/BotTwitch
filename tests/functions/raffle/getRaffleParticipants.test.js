import {
  getRaffleParticipants,
  joinRaffle,
  resetRaffleParticipants,
  resetRaffleStatus,
} from '../../../src/functions/raffle';

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
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaurer les vrais timers après chaque test
  });

  describe('getRaffleParticipants', () => {
    test('should return the current raffle participants', () => {
      joinRaffle({ 'user-id': '1', username: 'User1' });
      expect(getRaffleParticipants()).toEqual([{ id: '1', name: 'User1' }]);
    });
  });
});
