// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth.js';

/**
 * Envoie d'une requête à l'API twitch pour ajouter le rôle VIP à un utilisateur
 * @param {string} userId l'id de l'utilisateur a VIP
 * @return {void} log la réponse dans la console
 */
export const serviceMakeVip = async (userId) => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=${userId}`;
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

/**
 * Envoie d'une requête à l'API twitch pour enlever le rôle VIP à un utilisateur
 * @param {string} userId l'id de l'utilisateur a VIP
 * @return {void} log la réponse dans la console
 */
export const serviceRemoveVip = async (userId) => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=${userId}`;
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
