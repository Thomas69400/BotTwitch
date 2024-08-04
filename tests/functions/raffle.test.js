// raffle.test.js
import {
  startRaffle,
  joinRaffle,
  cancelRaffle,
  resetViewersRaffleInfo,
  resetRaffleStatus,
  getViewersRaffleInfo,
  getRaffleStatus,
} from '../../functions/raffle';
import { shuffleArray, checkRole } from '../../functions/utils';
import { addPoints } from '../../functions/points';

jest.mock('../../functions/utils');
jest.mock('../../functions/points');
jest.mock('../../auth');

describe('Raffle Functions', () => {
  let client;
  let tag;

  beforeEach(() => {
    client = {
      say: jest.fn(),
    };
    tag = {
      'user-id': '12345',
      username: 'testUser',
    };
    process.env.CHANNEL = '#testChannel';
    process.env.RAFFLE_WIN_RATIO = 50;
    resetViewersRaffleInfo(); // Réinitialiser viewersRaffleInfo avant chaque test
    resetRaffleStatus();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startRaffle', () => {
    test('should start a raffle and announce test', async () => {
      checkRole.mockReturnValue(1);
      shuffleArray.mockImplementation((array) => array);
      const message = '!raffle 100';

      await startRaffle(client, tag, message);

      expect(client.say).toHaveBeenCalledWith(
        '#testChannel',
        'Un raffle de 100 est en cours ! Tapez !join pour rejoindre !',
      );
      expect(shuffleArray).toHaveBeenCalled();
      expect(addPoints).toHaveBeenCalled();
    });

    test('should not start a raffle if user has insufficient role', async () => {
      checkRole.mockReturnValue(0);
      const message = '!raffle 100';

      await startRaffle(client, tag, message);

      expect(client.say).not.toHaveBeenCalled();
    });

    test('should announce winners correctly', async () => {
      checkRole.mockReturnValue(1);
      shuffleArray.mockImplementation((array) => array);
      const message = '!raffle 100';
      const viewersRaffleInfo = getViewersRaffleInfo();
      viewersRaffleInfo.push({ id: '12345', name: 'winner1' }, { id: '67890', name: 'winner2' });

      await startRaffle(client, tag, message);

      expect(client.say).toHaveBeenCalledWith('#testChannel', expect.stringContaining('Gagnant'));
      expect(addPoints).toHaveBeenCalledWith(expect.any(Array), expect.any(Number));
    });
  });

  describe('joinRaffle', () => {
    test('should allow a user to join the raffle', () => {
      joinRaffle(tag);
      const viewersRaffleInfo = getViewersRaffleInfo();
      expect(viewersRaffleInfo).toContainEqual({ id: '12345', name: 'testUser' });
    });

    test('should not add the same user twice', () => {
      joinRaffle(tag);
      joinRaffle(tag);
      const viewersRaffleInfo = getViewersRaffleInfo();
      expect(viewersRaffleInfo.length).toBe(1);
    });
  });

  describe('cancelRaffle', () => {
    test('should cancel an ongoing raffle', () => {
      checkRole.mockReturnValue(1);

      startRaffle(client, tag, '!raffle 5000');
      const oldRaffleStatus = getRaffleStatus();
      cancelRaffle(client, tag);
      const newRaffleStatus = getRaffleStatus();

      expect(client.say).toHaveBeenCalledWith('#testChannel', 'Le raffle a été annulé');

      expect(oldRaffleStatus).not.toBe(newRaffleStatus);
    });

    test('should not cancel a raffle if user has insufficient role', () => {
      checkRole.mockReturnValue(0);

      startRaffle(client, tag, '!raffle 5000');
      const oldRaffleStatus = getRaffleStatus();
      cancelRaffle(client, tag);
      const newRaffleStatus = getRaffleStatus();

      expect(client.say).not.toHaveBeenCalled();

      expect(oldRaffleStatus).toBe(newRaffleStatus);
    });
  });
});
