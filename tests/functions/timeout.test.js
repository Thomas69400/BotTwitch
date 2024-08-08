import { timeout } from '../../src/functions/timeout';
import { getViewer, getIdViewerByName, removePoints } from '../../src/functions/points';
import { serviceTimeout } from '../../src/services/timeout';
import { clearMessage, commandes } from '../../src/functions/utils';
import { getUser } from '../../src/services/utils';
import { serviceWhisper } from '../../src/services/whisper';

jest.mock('../../src/functions/points');
jest.mock('../../src/services/timeout');
jest.mock('../../src/functions/utils');
jest.mock('../../src/services/utils');
jest.mock('../../src/services/whisper');

const mockClient = {
  reply: jest.fn(),
  say: jest.fn(),
};

const mockTags = {
  id: 'tagId',
  'user-id': '123',
  username: 'buyer',
};

const mockChannel = 'testChannel';
const mockMessage = '!timeout userToTimeout 10';

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TIMEOUT_BASE_COST = 1;
});

test('should respond with command help if arguments are incorrect', async () => {
  clearMessage.mockReturnValueOnce('!timeout userToTimeout notANumber');
  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(serviceWhisper).toHaveBeenCalledWith(
    '123',
    "Désolé, je n'ai pas compris la demande.\n Essayez celle-ci : !timeout pseudo durée(minutes) ex: !timeout tryllogy 1",
  );
  expect(mockClient.reply).not.toHaveBeenCalled();
});

test('should respond with not enough points if buyer has insufficient points', async () => {
  clearMessage.mockReturnValueOnce(mockMessage);
  getViewer.mockReturnValueOnce({ points: 5 });
  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(mockClient.reply).toHaveBeenCalledWith(
    mockChannel,
    "Tu n'as pas assez de points. MONKE",
    'tagId',
  );
});

test('should respond with user does not exist if userToTimeout is not found', async () => {
  clearMessage.mockReturnValueOnce(mockMessage);
  getViewer.mockReturnValueOnce({ points: 100 });
  getIdViewerByName.mockReturnValueOnce(null);
  getUser.mockReturnValueOnce([]);
  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(mockClient.reply).toHaveBeenCalledWith(
    mockChannel,
    "Cet utilisateur n'existe pas.",
    'tagId',
  );
});

test('should timeout user successfully', async () => {
  clearMessage.mockReturnValueOnce(mockMessage);
  getViewer.mockReturnValueOnce({ points: 100 });
  getIdViewerByName.mockReturnValueOnce('userToTimeoutId');
  serviceTimeout.mockReturnValueOnce(200);

  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(mockClient.say).toHaveBeenCalled();
  expect(removePoints).toHaveBeenCalledWith(
    expect.arrayContaining([expect.objectContaining({ id: '123' })]),
    10,
  );
});

test('should handle timeout error correctly', async () => {
  clearMessage.mockReturnValueOnce(mockMessage);
  getViewer.mockReturnValueOnce({ points: 100 });
  getIdViewerByName.mockReturnValueOnce('userToTimeoutId');
  serviceTimeout.mockReturnValueOnce(400);
  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(mockClient.reply).toHaveBeenCalledWith(
    mockChannel,
    'Cet utilisateur ne peut pas être timeout!',
    'tagId',
  );
});
