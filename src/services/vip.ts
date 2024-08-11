// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth';

/**
 * Envoie d'une requête à l'API twitch pour ajouter le rôle VIP à un utilisateur
 * @param {number} userId l'id de l'utilisateur a VIP
 * @return {number} le status de la requête
 */
export const serviceMakeVip = async (userId: number): Promise<number> => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=${userId}`;
  const headers = {
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.post(url, {}, { headers });
    return response.status;
  } catch (error: any) {
    return error.response.data.status;
  }
};

/**
 * Envoie d'une requête à l'API twitch pour enlever le rôle VIP à un utilisateur
 * @param {number} userId l'id de l'utilisateur a VIP
 * @return {void} log la réponse dans la console
 */
export const serviceRemoveVip = async (userId: number): Promise<void> => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=${userId}`;
  const headers = {
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.post(url, {}, { headers });
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('Error in vip function:', error.response ? error.response.data : error.message);
  }
};
