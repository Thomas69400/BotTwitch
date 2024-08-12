// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth';

/**
 * Envoie d'une requête à l'API twitch pour ajouter le rôle VIP à un utilisateur
 * @param {number} userId l'id de l'utilisateur a VIP
 * @param {boolean} toVip true si il faut vip l'utilisateur false s'il faut lui enlever le vip
 * @return {number} le status de la requête
 */
export const serviceVip = async (userId: number, toVip: boolean): Promise<number> => {
  const oauthToken = await getOauthToken(false);
  const url = `https://api.twitch.tv/helix/channels/vips?broadcaster_id=${process.env.BROADCASTER_ID}&user_id=${userId}`;
  const headers = {
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    let response;
    if(toVip) response = await axios.post(url, {}, { headers });
    else response = await axios.delete(url, { headers });
    return response.status;
  } catch (error: any) {
    return error.response.data.status;
  }
};