import { isNotOnLive } from '../services/auth.js';
import { shuffleArray, sleep, checkRole, toBoolean } from './utils.js';
import { addPoints } from './points.js';

const regexRaffle = /^!raffle/;
let raffleStatus = false;
let viewersRaffleInfo = [];

/**
 * Commencer un raffle
 * @param {any} client Le client
 * @param {Object} tag Les données de l'utilisateur de la commande
 * @param {String} message Le message envoyé sur le chat
 * @returns Nom des gagnants
 */
export const startRaffle = async (client, tag, message) => {
  if (toBoolean(process.env.LIVE_REQUIERED)) if (await isNotOnLive()) return;
  if (checkRole(tag) > 0) {
    raffleStatus = true;
    viewersRaffleInfo = [];
    const amount = message.replace(regexRaffle, '').replaceAll(' ', '');
    client.say(
      process.env.CHANNEL,
      `Un raffle de ${amount} est en cours ! Tapez !join pour rejoindre !`,
    );
    await sleep(process.env.TIMER_RAFFLE);
    if (!raffleStatus) return;
    raffleStatus = false;
    viewersRaffleInfo = shuffleArray(viewersRaffleInfo);
    if (viewersRaffleInfo.length <= 0) {
      client.say(process.env.CHANNEL, `Personne n'a rejoint le raffle Smoge`);
      return;
    }
    const ratioWinner = Math.round((viewersRaffleInfo.length * process.env.RAFFLE_WIN_RATIO) / 100);
    const listWinner = viewersRaffleInfo.slice(0, ratioWinner);
    const winnerNames = `${listWinner.map((winner) => {
      return winner.name;
    })}`;
    client.say(
      process.env.CHANNEL,
      `Gagnant${listWinner.length > 1 ? 's' : ''} du raffle : ${winnerNames.replaceAll(',', ' ')}`,
    );
    addPoints(listWinner, amount / ratioWinner);
  }
};

/**
 * Rejoindre un raffle en cours
 * @param {Object} tags Les données d'un utilisateur
 */
export const joinRaffle = (tags) => {
  if (!viewersRaffleInfo.find((user) => user.id === tags['user-id']))
    viewersRaffleInfo.push({ id: tags['user-id'], name: tags.username });
};

/**
 * Annule un raffle en cours
 * @param {any} client Le client
 * @param {Oject} tags Les données d'un utilisateur
 * @returns
 */
export const cancelRaffle = (client, tags) => {
  if (checkRole(tags) > 0) {
    client.say(process.env.CHANNEL, 'Le raffle a été annulé. PRANKEX');
    raffleStatus = false;
    return raffleStatus;
  }
};

/**
 * Remet les informations d'un raffle à vide
 */
export const resetViewersRaffleInfo = () => {
  viewersRaffleInfo = [];
};

/**
 * Remet le status du raffle à false
 */
export const resetRaffleStatus = () => {
  raffleStatus = false;
};

/**
 * Retourne les informations du raffle en cours
 * @returns viewersRaffleInfo
 */
export const getViewersRaffleInfo = () => {
  return viewersRaffleInfo;
};

/**
 * Retourne le status du raffle
 * @returns raffleStatus
 */
export const getRaffleStatus = () => {
  return raffleStatus;
};
