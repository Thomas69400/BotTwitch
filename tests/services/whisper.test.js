import axios from 'axios';
import { serviceWhisper } from '../../services/whisper';
import { getOauthToken } from '../../services/auth';

jest.mock('axios');
jest.mock('../../services/auth.js');

describe('serviceWhisper', () => {
  let originalLog;
  let originalError;

  beforeAll(() => {
    originalLog = console.log;
    originalError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalLog;
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BOT_ID = 'test-bot-id';
    process.env.CLIENTID = 'test-client-id';
  });

  test('should send a whisper message successfully', async () => {
    const mockToken = 'mockToken';
    const mockResponse = { status: 200 };

    getOauthToken.mockResolvedValue(mockToken);
    axios.post.mockResolvedValue(mockResponse);

    const status = await serviceWhisper('test-user-id', 'Hello! This is a test message.');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/whispers?from_user_id=test-bot-id&to_user_id=test-user-id',
      { message: 'Hello! This is a test message.' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
          'Client-Id': 'test-client-id',
        },
      },
    );
    expect(status).toBe(200);
  });

  test('should handle error correctly when whisper fails', async () => {
    const mockToken = 'mockToken';
    const mockError = { response: { data: { status: 400, message: 'Bad Request' } } };

    getOauthToken.mockResolvedValue(mockToken);
    axios.post.mockRejectedValue(mockError);

    const status = await serviceWhisper('test-user-id', 'Hello! This is a test message.');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/whispers?from_user_id=test-bot-id&to_user_id=test-user-id',
      { message: 'Hello! This is a test message.' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
          'Client-Id': 'test-client-id',
        },
      },
    );
    expect(console.error).toHaveBeenCalledWith('Error dans timeout:', mockError.response.status);
    expect(status).toBe(400);
  });
});
