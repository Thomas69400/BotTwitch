import axios from 'axios';
import { getOauthToken } from './auth.js';

/**
 * Envoie d'un message privé par le bot à un utilisateur en particulier
 * @param {number} userId id de l'utilisateur à qui on envoie le message privé
 * @param {string} messageToSend message que va envoyer le bot
 * @returns {number} response.status: le status de la requête
 */
export const serviceWhisper = async (userId, messageToSend) => {
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
  } catch (error) {
    console.error('Error dans timeout:', error.response.status);
    return error.response.data.status;
  }
};
