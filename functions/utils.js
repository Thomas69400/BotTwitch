export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retourne un tableau mélangé dans le désordre total
 * @param {Array} array Tableau à mélanger
 * @returns array : le tableau mélangé
 */
export const shuffleArray = (array) => {
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
 * @param {Object} tags Les données de l'utilisateur
 * @returns integer 0 si rien ; 1 si modérateur ; 2 si diffuseur
 */
export const checkRole = (tags) => {
  if (tags?.badges?.broadcaster == 1) return 2;
  else if (tags.mod === true) return 1;
  else return 0;
};

/**
 * Arrondi le nombre passé à la dizaine supérieur
 * @param {integer} number Le nombre à arrondir
 * @returns {integer} Le nombre arrondi
 */
export const roundNumber = (number) => {
  return Math.ceil(number / 10) * 10;
};

export const toBoolean = (value) => {
  return value === 'true';
};

/**
 * Nettoyer le message en supprimant les caractères non imprimables et les paires de substitution Unicode ;
 * Supprime les paires de substitution Unicode ;
 * Supprime les espaces à la fin de la chaîne ;
 * Supprime les espaces au début de la chaîne ;
 * Remplace les espaces multiples par un seul espace
 * @param {string} message
 * @returns message
 */
export const clearMessage = (message) => {
  message = message
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/\s+$/, '')
    .replace(/^\s+/, '')
    .replace(/\s+/g, ' ');
  return message;
};

/**
 * Donne à l'utilisateur la bonne façon d'utiliser les commandes
 * @param {string} [message] (les crochets signifient que c'est optionnel) la commande à utiliser ou rien si on veut une listes des commandes
 * @returns string la façon dont on utilise la commande
 */
export const commandes = (message) => {
  switch (message) {
    case 'timeout':
      return `!timeout pseudo durée(minutes) ex: !timeout ${process.env.CHANNEL} 1 --> prix : ${process.env.TIMEOUT_BASE_COST}`;
    case 'vip':
      return `!vip pseudo ex: !vip ${process.env.CHANNEL}`;
    default:
      return 'Commandes disponible: !timeout ; !vip ; !unvip';
  }
};
