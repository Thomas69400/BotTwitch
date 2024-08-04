import axios from 'axios';
import { getOauthToken } from '../../services/auth';
import { serviceMakeVip, serviceRemoveVip } from '../../services/vip';

jest.mock('axios');
jest.mock('../../services/auth.js');

describe('VIP Services', () => {
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
    process.env.BROADCASTER_ID = 'test-broadcaster-id';
    process.env.CLIENTID = 'test-client-id';
  });

  describe('serviceMakeVip', () => {
    test('should make a user VIP successfully', async () => {
      const mockToken = 'mockToken';
      const mockResponse = { data: { message: 'User made VIP' } };

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockResponse);

      await serviceMakeVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.log).toHaveBeenCalledWith('Response:', mockResponse.data);
    });

    test('should handle error correctly when request fails with response data', async () => {
      const mockToken = 'mockToken';
      const mockError = { response: { data: { status: 400, message: 'Bad Request' } } };

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(mockError);

      await serviceMakeVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.error).toHaveBeenCalledWith('Error in vip function:', mockError.response.data);
    });

    test('should handle error correctly when request fails without response data', async () => {
      const mockToken = 'mockToken';
      const mockError = new Error('Network Error');

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(mockError);

      await serviceMakeVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.error).toHaveBeenCalledWith('Error in vip function:', 'Network Error');
    });
  });

  describe('serviceRemoveVip', () => {
    test('should remove VIP from a user successfully', async () => {
      const mockToken = 'mockToken';
      const mockResponse = { data: { message: 'User removed from VIP' } };

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockResponse);

      await serviceRemoveVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.log).toHaveBeenCalledWith('Response:', mockResponse.data);
    });

    test('should handle error correctly when request fails with response data', async () => {
      const mockToken = 'mockToken';
      const mockError = { response: { data: { status: 400, message: 'Bad Request' } } };

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(mockError);

      await serviceRemoveVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.error).toHaveBeenCalledWith('Error in vip function:', mockError.response.data);
    });

    test('should handle error correctly when request fails without response data', async () => {
      const mockToken = 'mockToken';
      const mockError = new Error('Network Error');

      getOauthToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(mockError);

      await serviceRemoveVip('test-user-id');

      expect(getOauthToken).toHaveBeenCalledWith(false);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.twitch.tv/helix/channels/vips?broadcaster_id=test-broadcaster-id&user_id=test-user-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Client-Id': 'test-client-id',
          },
        },
      );
      expect(console.error).toHaveBeenCalledWith('Error in vip function:', 'Network Error');
    });
  });
});
