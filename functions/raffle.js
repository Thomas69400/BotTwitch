import { getAccessToken } from '../auth.js';

const regexRaffle = /^!raffle/;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let isRaffleStarted = false;

// Commence un raffle
export const startRaffle = async (tag, message) => {
  if (!true) return; // TODO mettre isOnLive
  if (tag['mod'] == true || tag['badges']['broadcaster'] == 1) {
    isRaffleStarted = true;
    let winAmont = message.replace(regexRaffle, '').replaceAll(' ', '');
    // Attendre 30 secondes
    await sleep(5000);
    if (isRaffleStarted) {
      isRaffleStarted = false;
      return { raffleStatus: isRaffleStarted, listViewersJoined: [] };
    }
  }
  return;
};

export const joinRaffle = (tag, message) => {};

// Annule un raffle en cours
export const cancelRaffle = (tag, raffleStatus) => {
  if (!true) return raffleStatus; // TODO mettre isOnLive
  if (tag['mod'] == true || tag['badges']['broadcaster'] == 1) {
    isRaffleStarted = false;
    return raffleStatus;
  }
};
