import axios from 'axios';
import { getOauthTokenBot } from './auth.js';

/**
 * Envoie d'une requête à l'API twitch pour timeout un viewer
 * @param {integer} idTimeout l'id de la personne qui va se faire timeout
 * @param {integer} time le temps en secondes du timeout
 * @param {string} buyer le nom de la personne qui a acheté la récompense
 */
export const serviceTimeout = async (idTimeout, time, buyer) => {
  const oauthToken = await getOauthTokenBot();
  const url = `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${process.env.BROADCASTER_ID}&moderator_id=${process.env.BOT_ID}`;
  const data = {
    data: { user_id: idTimeout, duration: time, reason: `timeout by ${buyer} with points` },
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.post(url, data, { headers });
  } catch (error) {
    console.error('Error dans timeout:', error);
  }
};
