import { getOauthToken } from './auth.js';
import axios from 'axios';

export const serviceMakeVip = async () => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=89904723`;
  const headers = {
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.post(url, {}, { headers });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error in vip function:', error.response ? error.response.data : error.message);
  }
};

export const serviceRemoveVip = async () => {};
