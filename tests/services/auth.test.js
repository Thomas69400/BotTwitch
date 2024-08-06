// Import Package
import axios from 'axios';

// Import Services
import { getLive, getOauthToken } from '../../services/auth.js';

jest.mock('axios');

describe('Twitch API Service', () => {
  beforeAll(() => {
    process.env.CLIENTID = 'mockClientId';
    process.env.SECRET = 'mockSecret';
    process.env.REFRESH_TOKEN_BOT = 'mockRefreshTokenBot';
    process.env.REFRESH_TOKEN_BROADCASTER = 'mockRefreshTokenBroadcaster';
    process.env.CHANNEL = 'mockChannel';
  });

  describe('getOauthToken', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    test('should return the access token for bot', async () => {
      const mockToken = 'mockAccessToken';
      axios.post.mockResolvedValue({ data: { access_token: mockToken } });

      const result = await getOauthToken(true);

      expect(result).toBe(mockToken);
      expect(axios.post).toHaveBeenCalledWith(
        'https://id.twitch.tv/oauth2/token',
        expect.any(URLSearchParams),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    test('should return the access token for broadcaster', async () => {
      const mockToken = 'mockAccessToken';
      axios.post.mockResolvedValue({ data: { access_token: mockToken } });

      const result = await getOauthToken(false);

      expect(result).toBe(mockToken);
      expect(axios.post).toHaveBeenCalledWith(
        'https://id.twitch.tv/oauth2/token',
        expect.any(URLSearchParams),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    test('should handle errors', async () => {
      const mockError = new Error('mockError');
      axios.post.mockRejectedValue(mockError);

      const result = await getOauthToken(true);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Error:', mockError);
    });
  });

  describe('getLive', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    test('should return live stream data', async () => {
      const mockToken = 'mockAccessToken';
      const mockData = [{ id: 'mockStreamId' }];
      axios.post.mockResolvedValue({ data: { access_token: mockToken } });
      axios.get.mockResolvedValue({ data: { data: mockData } });

      const result = await getLive();

      expect(result).toBe(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.twitch.tv/helix/streams?user_login=mockChannel`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'mockClientId',
          },
        },
      );
    });

    test('should handle errors', async () => {
      const mockToken = 'mockAccessToken';
      const mockError = new Error('mockError');
      axios.post.mockResolvedValue({ data: { access_token: mockToken } });
      axios.get.mockRejectedValue(mockError);

      const result = await getLive();

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Error dans getLive:', mockError);
    });
  });
});
