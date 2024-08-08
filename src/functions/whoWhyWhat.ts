// Import Package
import { randomInt } from 'crypto';

// Import Type
import { CooldownUser, Tags } from '../types/types';

let userCooldowns: CooldownUser = {}; // Objet pour stocker le temps de cooldown pour les utilisateurs
const COOLDOWN_TIME = 600000; // 5 minutes en millisecondes

/**
 * Retourne un tableau des mots en enlevant les espaces et en inversant le tableau
 * @param {string[]} words
 * @returns {string[]} le tableau inversé passé en paramètre
 */
export const deleteEmptyWords = (words: string[]): string[] => {
  words = words.filter((word: string) => {
    if (word.length > 0) return word;
  });
  return words.reverse();
};

/**
 * Cooldown pour pas que le bot spam les quette et feur à la même personne
 * @param {string} userId l'ID de l'utilisateur
 * @returns {boolean} false si pas actif / cooldown écoulé True si actif
 */
export const checkCooldown = (userId: string): boolean => {
  const now = new Date();
  // SI IL N'EXISTE PAS MAIS QU'IL A DIT QUI QUOI OU POURQUOI ALORS IL EXISTE ET A UN TIMER
  if (!userCooldowns[userId]) {
    userCooldowns[userId] = now;
    return false; // Pas de cooldown actif
  }

  // SI IL EXISTE ET QU'IL A UN COOLDOWN (IL A DIT QUI QUOI OU POURQUOI) ALORS SON COOLDOWN EST DESCENDU IL LUI RESTE ALORS COOLDOWN_TIME - HEURE DU MESSAGE
  if (now.getTime() - userCooldowns[userId].getTime() > COOLDOWN_TIME) {
    userCooldowns[userId] = now;
    return false;
  }
  return true; // Cooldown encore actif
};

/**
 * Regarde si un utilisateur a fini sa phrase par pourquoi et n'a pas de cooldown puis répond en conséquence
 * @param {Object} client le client
 * @param {string} channel le channel
 * @param {string} message le message que l'utilisateur envoie
 * @param {Tags} tags les données de l'utilisateur qui a envoyé le message
 */
export const checkForPourquoi = (client: any, channel: string, message: string, tags: Tags) => {
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
export const checkForQuoi = (client: any, channel: string, message: string, tags: Tags) => {
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
 * @param {string} channel Le channel
 * @param {string} message Le message que la personne envoie
 * @param {Tags} tags Les données de la personne qui a envoyé le message
 * @returns {void}
 */
export const checkForQui = (client: any, channel: string, message: string, tags: Tags): void => {
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
