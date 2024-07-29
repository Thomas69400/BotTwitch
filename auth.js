import axios from 'axios';

export const getAccessToken = async () => {
  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID);
  data.append('client_secret', process.env.SECRET);
  data.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
