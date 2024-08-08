// Import Package
import axios from 'axios';
import { Live } from '../types/service.types';

/**
 * Envoie d'une requête à l'API twitch pour récupérer un Oauth Token version User soit pour le bot soit pour le streamer
 * @param {boolean} forBot si on veut récupérer le token du bot ou non
 * @return {string} access_token contenant le token
 */
export const getOauthToken = async (forBot: boolean): Promise<string | undefined> => {
  console.log('in service getOauthToken');

  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID as string);
  data.append('client_secret', process.env.SECRET as string);
  data.append('grant_type', 'refresh_token');
  forBot
    ? data.append('refresh_token', process.env.REFRESH_TOKEN_BOT as string)
    : data.append('refresh_token', process.env.REFRESH_TOKEN_BROADCASTER as string);

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Envoie d'une requête à l'API twitch pour récupérer chaînes en live et voir si notre stream l'est
 * @return {Object} la requête passée
 */ // TODO voir l'objet et en faire un type précis
export const getLive = async (): Promise<Live[] | undefined> => {
  console.log('in service getLive');

  const accesToken = await getOauthToken(true);
  const url = `https://api.twitch.tv/helix/streams?user_login=${process.env.CHANNEL}`;
  const headers = { Authorization: `Bearer ${accesToken}`, 'Client-Id': process.env.CLIENTID };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error dans getLive:', error);
  }
};
