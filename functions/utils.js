export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const checkRole = (tags) => {
  if (tags['badges']['broadcaster'] == 1) return 2;
  else if (tags['mod'] === true) return 1;
  else return 0;
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
