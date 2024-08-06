// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from '../../services/auth.js';
import { getUser } from '../../services/utils.js';

jest.mock('axios');
jest.mock('../../services/auth.js');

describe('getUser', () => {
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
    process.env.CLIENTID = 'test-client-id';
  });

  test('should retrieve a user successfully', async () => {
    const mockToken = 'mockToken';
    const mockResponse = { data: { data: [{ id: 'user-id', login: 'testUser' }] } };

    getOauthToken.mockResolvedValue(mockToken);
    axios.get.mockResolvedValue(mockResponse);

    const user = await getUser('testUser');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.get).toHaveBeenCalledWith('https://api.twitch.tv/helix/users?login=testUser', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
        'Client-Id': 'test-client-id',
      },
    });
    expect(user).toEqual([{ id: 'user-id', login: 'testUser' }]);
  });

  test('should handle error correctly when request fails', async () => {
    const mockToken = 'mockToken';
    const mockError = new Error('Network Error');

    getOauthToken.mockResolvedValue(mockToken);
    axios.get.mockRejectedValue(mockError);

    const user = await getUser('testUser');

    expect(getOauthToken).toHaveBeenCalledWith(true);
    expect(axios.get).toHaveBeenCalledWith('https://api.twitch.tv/helix/users?login=testUser', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
        'Client-Id': 'test-client-id',
      },
    });
    expect(user).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('Error dans timeout:', mockError);
  });
});
