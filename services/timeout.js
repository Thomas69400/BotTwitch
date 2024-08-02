import axios from 'axios';
import { getOauthToken } from './auth.js';

/**
 * Envoie d'une requête à l'API twitch pour timeout un viewer
 * @param {number} userId l'id de la personne qui va se faire timeout
 * @param {number} time le temps en secondes du timeout
 * @param {string} buyer le nom de la personne qui a acheté la récompense
 * @return response : contient le status de la requête
 */
export const serviceTimeout = async (userId, time, buyer) => {
  const oauthToken = await getOauthToken(true);
  const url = `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${process.env.BROADCASTER_ID}&moderator_id=${process.env.BOT_ID}`;
  const data = {
    data: {
      user_id: userId,
      duration: time,
      reason: `Timeout par ${buyer} grâce aux merveilleux points.`,
    },
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.post(url, data, { headers });
    return response.status;
  } catch (error) {
    console.error('Error dans timeout:', error.response.data);
    return error.response.data.status;
  }
};
