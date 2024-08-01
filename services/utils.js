import axios from 'axios';
import { getOauthTokenBot } from './auth.js';

export const getUser = async (name) => {
  const oauthToken = await getOauthTokenBot();
  const url = `https://api.twitch.tv/helix/users?login=${name}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error dans timeout:', error);
  }
};
