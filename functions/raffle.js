import { isOnLive } from '../auth.js';
import { shuffleArray, sleep, checkRole } from './utils.js';
import { addPoints } from './points.js';

const regexRaffle = /^!raffle/;
let raffleStatus = false;
let listViewersJoined = [];
const messageRaffleStarted = 'Un raffle est en cours ! Tapez !join pour rejoindre !';
const messageRaffleCancel = 'Le raffle a été annulé';

// Commencer un raffle
export const startRaffle = async (client, tag, message) => {
  //if (isOnLive() != 0) return;
  if (checkRole(tag) > 0) {
    raffleStatus = true;
    listViewersJoined = [];
    client.say(process.env.CHANNEL, messageRaffleStarted);
    await sleep(5000); // TODO mettre pour attendre 30 secondes
    if (!raffleStatus) return;
    raffleStatus = false;
    listViewersJoined = shuffleArray(listViewersJoined);
    const ratioWinner = Math.round((listViewersJoined.length * process.env.RAFFLE_WIN_RATIO) / 100);
    const winAmount = message.replace(regexRaffle, '').replaceAll(' ', '') / ratioWinner;
    addPoints(listViewersJoined.slice(0, ratioWinner), winAmount);
  }
};

// Rejoindre un raffle en cours
export const joinRaffle = (tag) => {
  if (listViewersJoined.includes(tag['user-id'])) return;
  listViewersJoined.push(tag['user-id']);
};

// Annule un raffle en cours
export const cancelRaffle = (client, tag) => {
  if (checkRole(tag) > 0) {
    client.say(process.env.CHANNEL, messageRaffleCancel);
    raffleStatus = false;
    return raffleStatus;
  }
};
