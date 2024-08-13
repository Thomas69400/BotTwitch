// Import types
import { getLive } from '../services/auth';
import { RaffleEnjoyer, Tags } from '../types/types';

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retourne un tableau mélangé dans le désordre total
 * @param {RaffleEnjoyer[]} array Tableau à mélanger
 * @returns {RaffleEnjoyer[]} : le tableau mélangé
 */
export const shuffleArray = (array: RaffleEnjoyer[]): RaffleEnjoyer[] => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/**
 * Regarde si un utilisateur est un diffuseur, un modérateur ou un utilisateur normal
 * @param {Tags} tags Les données de l'utilisateur
 * @returns integer 0 si rien ; 1 si modérateur ; 2 si diffuseur
 */
export const checkRole = (tags: Tags) => {
  if (tags?.badges?.broadcaster == 1) return 2;
  else if (tags.mod === true) return 1;
  else return 0;
};

/**
 * Arrondi le nombre passé à la dizaine supérieur
 * @param {number} number Le nombre à arrondir
 * @returns {number} Le nombre arrondi
 */
export const roundNumber = (number: number): number => {
  return Math.ceil(number / 10) * 10;
};

export const toBoolean = (value: string | number): boolean => {
  return value === 'true';
};

/**
 * Nettoyer le message en supprimant les caractères non imprimables et les paires de substitution Unicode ;
 * Supprime les paires de substitution Unicode ;
 * Supprime les espaces à la fin de la chaîne ;
 * Supprime les espaces au début de la chaîne ;
 * Remplace les espaces multiples par un seul espace
 * @param {string} message
 * @returns {string} le message nettoyé
 */
export const clearMessage = (message: string): string => {
  const cleanedMessage = message
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Supprime les paires de substitution Unicode
    .replace(/\s+$/, '') // Supprime les espaces à la fin
    .replace(/^\s+/, '') // Supprime les espaces au début
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul espace
    .trim(); // Trim supplémentaire pour s'assurer qu'il n'y a pas d'espace en trop
  // Retourner une chaîne vide si le message nettoyé est vide
  return cleanedMessage || '';
};

/**
 * Donne à l'utilisateur la bonne façon d'utiliser les commandes
 * @param {string} [message] (les crochets signifient que c'est optionnel) la commande à utiliser ou rien si on veut une listes des commandes
 * @returns {string} la façon dont on utilise la commande
 */
export const commandes = (message?: string): string => {
  switch (message) {
    case 'timeout':
      return `!timeout pseudo durée(minutes) ex: !timeout ${process.env.CHANNEL} 1 --> prix : ${process.env.TIMEOUT_BASE_COST}`;
    case 'vip':
      return `!vip pseudo ex: !vip ${process.env.CHANNEL}`;
    default:
      return 'Commandes disponible: !timeout ; !points ; !classement'; //!vip ; !unvip
  }
};

/**
 * Regarde si c'est en live et si l'utilisateur a les droits
 * @param {boolean} needPermission Si l'utilisateur a besoin d'avoir les droits necessaires pour utiliser la commande
 * @param {Tags} [tags] Les données de l'utilisateur de la commande
 * @returns {boolean} Retourne True si l'utilisateur peut utiliser la commande et False si c'est hors live ou si l'utilisateur n'a pas le droit
 */
export const liveAndRight = async (needPermission: boolean, tags?: Tags): Promise<boolean> => {
  if (toBoolean(process.env.LIVE_REQUIERED as string)) {
    const isLive = await getLive();
    if (!isLive?.length) return false;
  }
  if (needPermission && tags) {
    if (checkRole(tags) === 0) return false;
  }
  return true;
};

/**
 * Fonction pour gérer les erreurs de timeout
 * @param {number} status le status de la requête
 * @param {Object} client le client
 * @param {Object} channel le channel
 * @param {string} replyId l'id de la personne qui reçoit la réponse
 */
export const handleStatusError = (
  status: number,
  client: any,
  channel: string,
  replyId: string,
) => {
  if (status === 400) {
    client.reply(channel, 'Impossible!', replyId);
  } else if (status < 200 || status >= 300) {
    client.reply(channel, 'Je ne peux pas faire cela.', replyId);
  }
};
