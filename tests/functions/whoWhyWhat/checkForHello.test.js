import { checkForHello } from '../../../src/functions/whoWhyWhat';
import { jest } from '@jest/globals';
import { addPoints } from '../../../src/functions/points';
import { liveAndRight } from '../../../src/functions/utils';

// Mock des fonctions externes
const mockClient = {
  reply: jest.fn(),
};

jest.mock('../../../src/functions/points');
jest.mock('../../../src/functions/utils');

describe('checkForHello', () => {
  const channel = 'testChannel';
  const message = 'Hello everyone!';
  const tags = {
    username: 'testUser',
    'user-id': '12345',
    id: '67890',
  };
  let client;

  beforeEach(() => {
    client = {
      reply: jest.fn(),
    };
    jest.clearAllMocks();
    process.env.HELLO_EMOTE = 'Hello';
    process.env.HELLO_MAX = '3';
    process.env.HELLO_PRIZE = '100';
    process.env.HELLO_DEBUFF = '10';
    process.env.POINT_NAME = 'points';
  });

  test('ne fait rien si une condition environnementale est manquante', async () => {
    delete process.env.HELLO_EMOTE;

    const viewersHello = [];
    await checkForHello(client, channel, message, tags, viewersHello);

    expect(client.reply).not.toHaveBeenCalled();
    expect(addPoints).not.toHaveBeenCalled();
  });

  test('ne fait rien si le nombre maximum de viewers a déjà été atteint', async () => {
    liveAndRight.mockReturnValue(true);

    const viewersHello = [
      { id: '111', name: '' },
      { id: '222', name: '' },
      { id: '333', name: '' },
    ];

    await checkForHello(client, channel, message, tags, viewersHello);

    expect(client.reply).not.toHaveBeenCalled();
    expect(addPoints).not.toHaveBeenCalled();
  });

  test("ajoute des points et envoie un message si l'emote est trouvée et le viewer est éligible", async () => {
    const viewersHello = [];
    liveAndRight.mockReturnValue(true);

    await checkForHello(client, channel, message, tags, viewersHello);

    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'testUser est le 1er à avoir Hello et gagne 100 points.',
      '67890',
    );
    expect(addPoints).toHaveBeenCalledWith([{ id: '12345' }], 100);
    expect(viewersHello).toEqual([{ id: '12345', name: 'testUser' }]);
  });

  test('n’ajoute pas un viewer déjà présent dans la liste', async () => {
    const viewersHello = [{ id: '12345', name: 'testUser' }];
    liveAndRight.mockReturnValue(true);

    await checkForHello(mockClient, channel, message, tags, viewersHello);

    expect(mockClient.reply).not.toHaveBeenCalled();
    expect(addPoints).not.toHaveBeenCalled();
    expect(viewersHello.length).toBe(1);
  });

  test('applique correctement la réduction de prix en fonction du nombre de viewers', async () => {
    const viewersHello = [{ id: '111' }, { id: '222' }];
    liveAndRight.mockReturnValue(true);

    await checkForHello(client, channel, message, tags, viewersHello);

    expect(client.reply).toHaveBeenCalledWith(
      channel,
      'testUser est le 3ième à avoir Hello et gagne 80 points.',
      '67890',
    );
    expect(addPoints).toHaveBeenCalledWith([{ id: '12345' }], 80);
    expect(viewersHello).toEqual([{ id: '111' }, { id: '222' }, { id: '12345', name: 'testUser' }]);
  });
});
