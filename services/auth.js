import axios from 'axios';

export const getOauthTokenBot = async () => {
  console.log('in service getOauthTokenBot');

  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID);
  data.append('client_secret', process.env.SECRET);
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', process.env.REFRESH_TOKEN_BOT);

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getOauthTokenBroadcaster = async () => {
  console.log('in service getOauthTokenBot');

  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID);
  data.append('client_secret', process.env.SECRET);
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', process.env.REFRESH_TOKEN_BROADCASTER);

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const isNotOnLive = async () => {
  const accesToken = await getOauthTokenBot();
  const url = `https://api.twitch.tv/helix/streams?user_login=${process.env.CHANNEL}`;
  const headers = { Authorization: `Bearer ${accesToken}`, 'Client-Id': process.env.CLIENTID };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data.length === 0;
  } catch (error) {
    console.error('Error dans isNotOnLive:', error);
  }
};
