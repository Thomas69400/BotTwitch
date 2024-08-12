import {
  resetRaffleParticipants,
  resetRaffleStatus,
  fakeRaffle,
} from '../../../src/functions/raffle';
import { sleep, liveAndRight } from '../../../src/functions/utils';

jest.mock('../../../src/functions/utils');
jest.mock('../../../src/functions/points');
jest.mock('../../../src/services/auth');

describe('fakeRaffle', () => {
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
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaurer les vrais timers après chaque test
  });

  // Importation des modules nécessaires

  test('should not start a raffle if one is already in progress', async () => {
    resetRaffleStatus();
    liveAndRight.mockReturnValue(true);
    await fakeRaffle(client, { mod: true }, 100);

    await fakeRaffle(client, { mod: true }, 100);
    expect(client.say).toHaveBeenCalled();
  });

  test('should not start a raffle if live is required and not live', async () => {
    liveAndRight.mockReturnValue(false);

    await fakeRaffle(client, {}, '100');
    expect(client.say).not.toHaveBeenCalled();
  });

  test('should not start a raffle if user role is not allowed', async () => {
    liveAndRight.mockReturnValue(false);

    await fakeRaffle(client, {}, '100');
    expect(client.say).not.toHaveBeenCalled();
  });

  test('should start a raffle and announce it was a fake', async () => {
    liveAndRight.mockReturnValue(true);
    sleep.mockResolvedValue();
    const client = { say: jest.fn() };

    await fakeRaffle(client, {}, '100');

    expect(client.say).toHaveBeenNthCalledWith(
      1,
      process.env.CHANNEL,
      'Un raffle de 100 est en cours! Tapez !join pour rejoindre!',
    );
    expect(client.say).toHaveBeenNthCalledWith(
      2,
      process.env.CHANNEL,
      "C'était un faux raffle PRANKEX",
    );
  });
});
