import { randomInt } from 'crypto';

const userCooldowns = {}; // Objet pour stocker le temps de cooldown pour les utilisateurs
const COOLDOWN_TIME = 10 * 60 * 1000; // 5 minutes en millisecondes

export const deleteEmptyWords = (words) => {
  words = words.filter((word) => {
    if (word.length > 0) return word;
  });
  return words.reverse();
};

// Cooldown pour pas que le bot spam les quette et feur à la même personne
export const checkCooldown = (user) => {
  const now = Date.now();
  if (!userCooldowns[user]) {
    userCooldowns[user] = now;
    return false;
  }
  const lastResponseTime = userCooldowns[user];
  if (now - lastResponseTime > COOLDOWN_TIME) {
    userCooldowns[user] = now;
    return false;
  }
  return true;
};

// Répondre FEUR après un 'pourquoi' en fin de phrase
export const checkForPourquoi = (client, channel, message, tags) => {
  const pourquoiRegex = /\bpourqu?o+i+\b/g;
  const replacedMessage = message.replace(pourquoiRegex, 'pourquoi');
  const responsesPourquoi = [
    'Tout simplement pour feur Pepega Pepega',
    'Pour feur :joy: :rofl: :rofl:',
    "Peut-être bien que c'est pour coubeh !",
    "Il me semble que c'est bien pour feur. Buratino",
  ];

  if (replacedMessage.search('pourquoi') !== -1) {
    const words = deleteEmptyWords(replacedMessage.split(' '));
    if (words[0] === 'pourquoi') {
      if (!checkCooldown(tags.username)) {
        client.reply(channel, responsesPourquoi[randomInt(responsesPourquoi.length)], tags.id);
      }
    }
  }
};

// Répondre FEUR après un 'quoi' en fin de phrase
export const checkForQuoi = (client, channel, message, tags) => {
  const quoiRegex = /\bqu?o+i+\b/g;
  const replacedMessage = message.replace(quoiRegex, 'quoi');
  const responsesQuoi = ['FEUR !!!!!', "Feur (coiffeur tu l'as ou pas ^^ ?)"];

  if (replacedMessage.search('quoi') !== -1) {
    const words = deleteEmptyWords(replacedMessage.split(' '));
    if (words[0] === 'quoi') {
      if (!checkCooldown(tags.username)) {
        client.reply(channel, responsesQuoi[randomInt(responsesQuoi.length)], tags.id);
      }
    }
  }
};

// Répondre Quette après un 'qui' en fin de phrase
export const checkForQui = (client, channel, message, tags) => {
  const quiRegex = /\bqu?i+\b/g;
  const replacedMessage = message.replace(quiRegex, 'qui');
  const responsesQui = [
    'Quette ou bien kette tel est la question :thinking:',
    "C'est quette MonkeySpin",
    "Quette (quiquette tu l'as ou pas ^^ ?)",
  ];

  if (replacedMessage.search('qui') !== -1) {
    const words = deleteEmptyWords(replacedMessage.split(' '));
    if (words[0] === 'qui') {
      if (!checkCooldown(tags.username)) {
        client.reply(channel, responsesQui[randomInt(responsesQui.length)], tags.id);
      }
    }
  }
};
