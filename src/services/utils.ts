// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from './auth';
import { User } from '../types/service.types';

/**
 * Envoie d'une requête à l'API twitch pour récupérer un User
 * @param {string} name le nom de la personne à récuperer
 * @return {Promise<User[] | undefined>} access_token contenant le token
 */
export const getUser = async (name: string): Promise<User[] | undefined> => {
  console.log('in getUser service');

  const oauthToken = await getOauthToken(true);
  const url = `https://api.twitch.tv/helix/users?login=${name}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${oauthToken}`,
    'Client-Id': process.env.CLIENTID,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error getUser:', error);
  }
};
