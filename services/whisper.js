import axios from 'axios';
import { getOauthTokenBot } from './auth.js';

/**
 * Envoie d'un message privé par le bot à un utilisateur en particulier
 * @param {Number} idToUser id de l'utilisateur qui reçoit le message privé
 * @param {String} messageToSend message que va envoyer le bot
 * @returns response.status : le status de la requête
 */
export const serviceWhisper = async (idToUser, messageToSend) => {
  const oauthToken = await getOauthTokenBot();
  const url = `https://api.twitch.tv/helix/whispers?from_user_id=${process.env.BOT_ID}&to_user_id=${idToUser}`;
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
