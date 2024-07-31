import axios from 'axios';

export const getAccessToken = async () => {
  console.log('in service getAccessToken');

  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID);
  data.append('client_secret', process.env.SECRET);
  data.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const isNotOnLive = async () => {
  const accesToken = await getAccessToken();
  const url = `https://api.twitch.tv/helix/streams?user_login=${process.env.CHANNEL}`;
  const headers = { Authorization: `Bearer ${accesToken}`, 'Client-Id': process.env.CLIENTID };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data.length === 0;
  } catch (error) {
    console.error('Error dans isNotOnLive:', error);
  }
};
