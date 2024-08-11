// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth';

/**
 * Envoie d'une requête à l'API twitch pour timeout un viewer
 * @param {number} userId l'id de la personne qui va se faire timeout
 * @param {number} time le temps en secondes du timeout
 * @param {string} buyer le nom de la personne qui a acheté la récompense
 * @return {number} le status de la requête
 */
export const serviceTimeout = async (
  userId: number,
  time: number,
  buyer: string,
): Promise<number> => {
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
  } catch (error: any) {
    return error.response.data.status;
  }
};
