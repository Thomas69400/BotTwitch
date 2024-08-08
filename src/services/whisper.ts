// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth';

/**
 * Envoie d'un message privé par le bot à un utilisateur en particulier
 * @param {string} userId id de l'utilisateur à qui on envoie le message privé
 * @param {string} messageToSend message que va envoyer le bot
 * @returns {number} response.status: le status de la requête
 */
export const serviceWhisper = async (userId: string, messageToSend: string): Promise<number> => {
  const oauthToken = await getOauthToken(true);
  const url = `https://api.twitch.tv/helix/whispers?from_user_id=${process.env.BOT_ID}&to_user_id=${userId}`;
  const data = {
    message: `${messageToSend}`,
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
    console.error('Error dans timeout:', error.response.status);
    return error.response.data.status;
  }
};
