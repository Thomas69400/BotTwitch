// Import Package
import { randomInt } from 'crypto';

let userCooldowns = {}; // Objet pour stocker le temps de cooldown pour les utilisateurs
const COOLDOWN_TIME = 600000; // 5 minutes en millisecondes

/**
 * Retourne un tableau des mots en enlevant les espaces et en inversant le tableau
 * @param {array} words
 * @returns {array} le tableau inversé passé en paramètre
 */
export const deleteEmptyWords = (words) => {
  words = words.filter((word) => {
    if (word.length > 0) return word;
  });
  return words.reverse();
};

/**
 * Cooldown pour pas que le bot spam les quette et feur à la même personne
 * @param {integer} userId l'ID de l'utilisateur
 * @returns {boolean} false si pas actif / cooldown écoulé True si actif
 */
export const checkCooldown = (userId) => {
  const now = Date.now();
  // SI IL N'EXISTE PAS MAIS QU'IL A DIT QUI QUOI OU POURQUOI ALORS IL EXISTE ET A UN TIMER
  if (!userCooldowns[userId]) {
    userCooldowns[userId] = now;
    return false; // Pas de cooldown actif
  }
  // SI IL EXISTE ET QU'IL A UN COOLDOWN (IL A DIT QUI QUOI OU POURQUOI) ALORS SON COOLDOWN EST DESCENDU IL LUI RESTE ALORS COOLDOWN_TIME - HEURE DU MESSAGE
  if (now - userCooldowns[userId] > COOLDOWN_TIME) {
    userCooldowns[userId] = now;
    return false;
  }
  return true; // Cooldown encore actif
};

/**
 * Regarde si un utilisateur a fini sa phrase par pourquoi et n'a pas de cooldown puis répond en conséquence
 * @param {Object} client le client
 * @param {Object} channel le channel
 * @param {string} message le message que l'utilisateur envoie
 * @param {Object} tags les données de l'utilisateur qui a envoyé le message
 */
export const checkForPourquoi = (client, channel, message, tags) => {
  const pourquoiRegex = /\bpourqu?o+i+\b/g;
  const replacedMessage = message.replace(pourquoiRegex, 'pourquoi').toLocaleLowerCase();
  const responsesPourquoi = [
    'Tout simplement pour feur Pepega Pepega',
    'Pour feur :joy: :rofl: :rofl:',
    "Peut-être bien que c'est pour coubeh !",
    "Il me semble que c'est bien pour feur. Buratino",
  ];

  if (replacedMessage.search('pourquoi') !== -1) {
    const words = deleteEmptyWords(replacedMessage.split(' '));
    if (words[0] === 'pourquoi') {
      if (!checkCooldown(tags['user-id'])) {
        client.reply(channel, responsesPourquoi[randomInt(responsesPourquoi.length)], tags.id);
      }
    }
  }
};

/**
 * Regarde si un utilisateur a fini sa phrase par quoi et n'a pas de cooldown puis répond en conséquence
 * @param {Object} client le client
 * @param {Object} channel le channel
 * @param {string} message le message que l'utilisateur envoie
 * @param {Object} tags les données de l'utilisateur qui a envoyé le message
 */
export const checkForQuoi = (client, channel, message, tags) => {
  const quoiRegex = /\bqu?o+i+\b/g;
  const replacedMessage = message.replace(quoiRegex, 'quoi').toLocaleLowerCase();
  const responsesQuoi = ['FEUR !!!!!', "Feur (coiffeur tu l'as ou pas ^^ ?)"];

  if (replacedMessage.search('quoi') !== -1) {
    const words = deleteEmptyWords(replacedMessage.split(' '));

    if (words[0] === 'quoi') {
      if (!checkCooldown(tags['user-id'])) {
        client.reply(channel, responsesQuoi[randomInt(responsesQuoi.length)], tags.id);
      }
    }
  }
};

/**
 * Regarde si un utilisateur a fini sa phrase par qui et n'a pas de cooldown puis répond en conséquence
 * @param {Object} client Le client
 * @param {Object} channel Le channel
 * @param {string} message Le message que la personne envoie
 * @param {Object} tags Les données de la personne qui a envoyé le message
 */
export const checkForQui = (client, channel, message, tags) => {
  const quiRegex = /\bqu?i+\b/g;
  const replacedMessage = message.replace(quiRegex, 'qui').toLocaleLowerCase();
  const responsesQui = [
    'Quette ou bien kette tel est la question :thinking:',
    "C'est quette MonkeySpin",
    "Quette (quiquette tu l'as ou pas ^^ ?)",
    "Feur aussi. Parce qu'en fait ça fait quifeur (kiffeur). Nerdge",
  ];
  if (replacedMessage.includes('qui')) {
    const words = deleteEmptyWords(replacedMessage.split(' '));
    if (words[0] === 'qui') {
      if (!checkCooldown(tags['user-id'])) {
        client.reply(channel, responsesQui[randomInt(responsesQui.length)], tags.id);
      }
    }
  }
};

/**
 * Réinitiallise la liste des utilisateurs en cooldown
 */
export const resetCooldowns = () => {
  for (let userId in userCooldowns) {
    if (userCooldowns.hasOwnProperty(userId)) {
      delete userCooldowns[userId];
    }
  }
};

/**
 * Retourne la variable COOLDOWN_TIME
 * @returns {integer} Le cooldown général
 */
export const getCooldownTime = () => {
  return COOLDOWN_TIME;
};
