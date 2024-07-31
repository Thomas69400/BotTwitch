import { isOnLive } from '../auth.js';
import { shuffleArray, sleep, checkRole } from './utils.js';
import { addPoints } from './points.js';

const regexRaffle = /^!raffle/;
let raffleStatus = false;
let viewersRaffleInfo = [];
const messageRaffleCancel = 'Le raffle a été annulé';

// Commencer un raffle
export const startRaffle = async (client, tags, message) => {
  //if (isOnLive() != 0) return;
  if (checkRole(tags) > 0) {
    raffleStatus = true;
    viewersRaffleInfo = [];
    const amount = message.replace(regexRaffle, '').replaceAll(' ', '');
    client.say(
      process.env.CHANNEL,
      `Un raffle de ${amount} est en cours ! Tapez !join pour rejoindre !`,
    );
    await sleep(10000); // TODO mettre pour attendre 30 secondes
    if (!raffleStatus) return;
    raffleStatus = false;
    viewersRaffleInfo = shuffleArray(viewersRaffleInfo);
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

// Rejoindre un raffle en cours
export const joinRaffle = (tags) => {
  if (!viewersRaffleInfo.find((user) => user.id === tags['user-id']))
    viewersRaffleInfo.push({ id: tags['user-id'], name: tags.username });
};

// Annule un raffle en cours
export const cancelRaffle = (client, tags) => {
  if (checkRole(tags) > 0) {
    client.say(process.env.CHANNEL, messageRaffleCancel);
    raffleStatus = false;
    return raffleStatus;
  }
};

export const resetViewersRaffleInfo = () => {
  viewersRaffleInfo = [];
};

export const resetRaffleStatus = () => {
  raffleStatus = false;
};

export const getViewersRaffleInfo = () => {
  return viewersRaffleInfo;
};

export const getRaffleStatus = () => {
  return raffleStatus;
};
