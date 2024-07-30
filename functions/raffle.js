import { isOnLive } from '../auth.js';
import { shuffleArray, sleep } from './utils.js'

const regexRaffle = /^!raffle/;
let raffleStatus = false;
let listViewersJoined = [];

// Commencer un raffle
export const startRaffle = async (tag, message) => {
  //if (isOnLive() != 0) return;
  if (tag['mod'] === true || tag['badges']['broadcaster'] == 1) {
    raffleStatus = true;
    listViewersJoined = [];
    const winAmount = message.replace(regexRaffle, '').replaceAll(' ', '');
    await sleep(5000); // Attendre 30 secondes
    if (!raffleStatus) return;
    raffleStatus = false;
    listViewersJoined = shuffleArray(listViewersJoined);
    for (let i = 0; i < Math.round(listViewersJoined.length * process.env.RAFFLE_WIN_RATIO / 100); i++){

    }
    const winners = [];
  }
};

// Rejoindre un raffle en cours
export const joinRaffle = (tag) => {
  if (listViewersJoined.includes(tag['user-id'])) return;
  listViewersJoined.push(tag['user-id']);
};

// Annule un raffle en cours
export const cancelRaffle = (tag) => {
  //if (isOnLive() != 0) return raffleStatus;
  if (tag['mod'] === true || tag['badges']['broadcaster'] == 1) {
    raffleStatus = false;
    return raffleStatus;
  }
};
