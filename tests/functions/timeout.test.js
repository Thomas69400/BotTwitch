import { timeout } from '../../functions/timeout';
import { getViewer, getIdViewerByName, removePoints } from '../../functions/points';
import { serviceTimeout } from '../../services/timeout';
import { clearMessage, commandes } from '../../functions/utils';
import { getUser } from '../../services/utils';
import { serviceWhisper } from '../../services/whisper';

jest.mock('../../functions/points');
jest.mock('../../services/timeout');
jest.mock('../../functions/utils');
jest.mock('../../services/utils');
jest.mock('../../services/whisper');

const mockClient = {
  reply: jest.fn(),
  say: jest.fn(),
};

const mockTags = {
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
    undefined,
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
    undefined,
  );
});

test('should timeout user successfully', async () => {
  clearMessage.mockReturnValueOnce(mockMessage);
  getViewer.mockReturnValueOnce({ points: 100 });
  getIdViewerByName.mockReturnValueOnce('userToTimeoutId');
  serviceTimeout.mockReturnValueOnce(200);

  await timeout(mockClient, mockChannel, mockTags, mockMessage);

  expect(mockClient.say).toHaveBeenCalled();
  expect(removePoints).toHaveBeenCalledWith([{ id: '123', name: 'buyer' }], 10);
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
    undefined,
  );
});
