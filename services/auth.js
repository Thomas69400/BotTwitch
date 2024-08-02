import axios from 'axios';

/**
 * Envoie d'une requête à l'API twitch pour récupérer un Oauth Token version User soit pour le bot soit pour le streamer
 * @param {boolean} forBot si on veut récupérer le token du bot ou non
 * @return {string} access_token contenant le token
 */
export const getOauthToken = async (forBot) => {
  console.log('in service getOauthToken');

  const data = new URLSearchParams();
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const url = 'https://id.twitch.tv/oauth2/token';

  data.append('client_id', process.env.CLIENTID);
  data.append('client_secret', process.env.SECRET);
  data.append('grant_type', 'refresh_token');
  forBot
    ? data.append('refresh_token', process.env.REFRESH_TOKEN_BOT)
    : data.append('refresh_token', process.env.REFRESH_TOKEN_BROADCASTER);

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Envoie d'une requête à l'API twitch pour récupérer chaînes en live et voir si notre stream l'est
 * @return {boolean} si il est en live ou non
 */
export const isNotOnLive = async () => {
  console.log('in service isNotOnLive');

  const accesToken = await getOauthToken(true);
  const url = `https://api.twitch.tv/helix/streams?user_login=${process.env.CHANNEL}`;
  const headers = { Authorization: `Bearer ${accesToken}`, 'Client-Id': process.env.CLIENTID };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data.length === 0;
  } catch (error) {
    console.error('Error dans isNotOnLive:', error);
  }
};
