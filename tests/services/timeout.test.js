// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from '../../services/auth.js';
import { serviceTimeout } from '../../services/timeout.js';

jest.mock('axios');
jest.mock('../../services/auth.js');

describe('serviceTimeout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BROADCASTER_ID = '12345';
    process.env.BOT_ID = '67890';
    process.env.CLIENTID = 'test-client-id';
  });

  test('should timeout a user successfully', async () => {
    const mockToken = 'mockToken'; // Correct the mock token value
    const mockResponse = { status: 204 };

    getOauthToken.mockResolvedValue(mockToken);
    axios.post.mockResolvedValue(mockResponse);

    const status = await serviceTimeout('user-id', 600, 'testBuyer');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/moderation/bans?broadcaster_id=12345&moderator_id=67890',
      {
        data: {
          user_id: 'user-id',
          duration: 600,
          reason: 'Timeout par testBuyer grâce aux merveilleux points.',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`, // Use the correct mock token value
          'Client-Id': 'test-client-id',
        },
      },
    );
    expect(status).toBe(204);
  });

  test('should return error status when timeout fails', async () => {
    const mockToken = 'mockToken'; // Correct the mock token value
    const mockError = {
      response: {
        data: {
          status: 400,
          message: 'Bad Request',
        },
      },
    };

    getOauthToken.mockResolvedValue(mockToken);
    axios.post.mockRejectedValue(mockError);

    const status = await serviceTimeout('user-id', 600, 'testBuyer');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/moderation/bans?broadcaster_id=12345&moderator_id=67890',
      {
        data: {
          user_id: 'user-id',
          duration: 600,
          reason: 'Timeout par testBuyer grâce aux merveilleux points.',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`, // Use the correct mock token value
          'Client-Id': 'test-client-id',
        },
      },
    );
    expect(status).toBe(400);
  });
});
