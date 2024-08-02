import { isNotOnLive } from '../services/auth.js';
import { addPoints } from './points.js';
import { checkRole, shuffleArray, sleep, toBoolean, roundNumber } from './utils.js';

let raffleStatus = false;
let raffleParticipants = [];

/**
 * Commencer un raffle
 * @param {Object} client Le client
 * @param {Object} tags Les données de l'utilisateur de la commande
 * @param {string} amount Le montant à envoyer dans le chat
 * @returns {void} affiche le noms de gagnants et ajoute les points ou un message de non-lieu
 */
export const startRaffle = async (client, tags, amount) => {
  if (raffleStatus) return; // Si un raffle est déjà en cours
  if (toBoolean(process.env.LIVE_REQUIERED)) if (await isNotOnLive()) return;
  if (checkRole(tags) === 0) return;

  // on crée un nouveau raffle donc on reset les participants
  raffleStatus = true;
  raffleParticipants = [];

  client.say(
    process.env.CHANNEL,
    `Un raffle de ${amount} est en cours! Tapez !join pour rejoindre!`,
  );

  await sleep(process.env.TIMER_RAFFLE);

  // une fois le timer passé, si le raffle ne s'est pas fait cancel on le désactive
  // et on pick les gagnants
  if (!raffleStatus) return;
  raffleStatus = false;
  raffleParticipants = shuffleArray(raffleParticipants);
  if (raffleParticipants.length <= 0) {
    client.say(process.env.CHANNEL, `Personne n'a rejoint le raffle Smoge`);
    return;
  }

  const ratioWinner = Math.round((raffleParticipants.length * process.env.RAFFLE_WIN_RATIO) / 100)
    ? Math.round((raffleParticipants.length * process.env.RAFFLE_WIN_RATIO) / 100)
    : 1;

  const listWinner = raffleParticipants.slice(0, ratioWinner);
  const winnerNames = `${listWinner.map((winner) => {
    return winner.name;
  })}`;

  client.say(
    process.env.CHANNEL,
    `Gagnant${listWinner.length > 1 ? 's' : ''} du raffle : ${winnerNames.replaceAll(',', ' ')}`,
  );
  addPoints(listWinner, Math.ceil(amount / ratioWinner));
};

/**
 * Quand un utilisateur demande un raffle, le bot en lance un
 * @param {Object} client le client
 */
//TODO Faire un @Thomas69400 => ratio🤣 du nombre de raffle fait pendant le live avec le temps de live passé. Si le ratio est inferieur a x alors on lance un raffle sinon pas de raffle
export const begForRaffle = (client) => {
  const value = roundNumber(
    Math.random() *
      (Number(process.env.RANDOM_RAFFLE_MAX) - Number(process.env.RANDOM_RAFFLE_MIN)) +
      Number(process.env.RANDOM_RAFFLE_MIN),
  );
  startRaffle(client, { mod: true }, value);
};

/**
 * Rejoindre un raffle en cours
 * @param {Object} tags Les données d'un utilisateur
 * @returns {void} mais ajoute les données de l'utilisateur dans la variable global raffleParticipants
 */
export const joinRaffle = (tags) => {
  if (!raffleParticipants.find((user) => user.id === tags['user-id']))
    raffleParticipants.push({ id: tags['user-id'], name: tags.username });
};

/**
 * Annule un raffle en cours
 * @param {Object} client Le client
 * @param {Object} tags Les données d'un utilisateur
 * @returns {boolean} raffleStatus
 */
export const cancelRaffle = (client, tags) => {
  if (checkRole(tags) > 0) {
    client.say(process.env.CHANNEL, 'Le raffle a été annulé. PRANKEX');
    raffleStatus = false;
    return raffleStatus;
  }
};

/**
 * Réinitialise la variable globale `raffleParticipants` à un tableau vide.
 * N'est utilisé que dans les fichiers test
 * @returns {void} Cette fonction ne retourne rien mais change la valeur d'une variable global
 */
export const resetRaffleParticipants = () => {
  raffleParticipants = [];
};

/**
 * Réinitialise la variable globale `raffleStatus` à false.
 * N'est utilisé que dans les fichiers test
 * @returns {void}
 */
export const resetRaffleStatus = () => {
  raffleStatus = false;
};

/**
 * Retourne les informations des participants au raffle en cours
 * N'est utilisé que dans les fichiers test
 * @returns {Object[]} raffleParticipants
 */
export const getRaffleParticipants = () => {
  return raffleParticipants;
};

/**
 * Retourne le status du raffle
 * N'est utilisé que dans les fichiers test
 * @returns {boolean} raffleStatus
 */
export const getRaffleStatus = () => {
  return raffleStatus;
};
