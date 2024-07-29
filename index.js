import dotenv from 'dotenv';
import tmi from 'tmi.js';

import {
  checkCooldown,
  checkForPourquoi,
  checkForQui,
  checkForQuoi,
} from './functions/whoWhyWhat.js';
import { savePoints, addPoints, checkViewers } from './functions/points.js';
import { startRaffle, cancelRaffle, joinRaffle } from './functions/raffle.js';

dotenv.config();

// Initialisation
const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'LytchiBot',
    password: process.env.TOKEN_OAUTH,
  },
  channels: [process.env.CHANNEL],
});
client.connect().catch(console.error);

// Regex
const onlyLetter = /[^a-z\s]/g;
let raffleStatus = false;
let listViewersJoined = [];

client.on('message', (channel, tags, message, self) => {
  // Le bot ne répond pas à lui-même
  if (self) return;

  // Si le spectateur n'est pas déjà suivi par le systeme de point, l'ajoute
  checkViewers(tags);
  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');
  if (message.startsWith('!raffle')) {
    const data = startRaffle(tags, message.toLowerCase(), raffleStatus);
    console.log(data['raffleStatus']);
  }
  if (message.startsWith('!cancel')) raffleStatus = cancelRaffle(tags, raffleStatus);
  if (message.startsWith('!join') && raffleStatus) {
    joinRaffle(tags, message.toLowerCase());
  }
  checkCooldown();

  checkForPourquoi(client, channel, trunkMessage, tags);
  checkForQuoi(client, channel, trunkMessage, tags);
  checkForQui(client, channel, trunkMessage, tags);
});

// Ajouter des points selon un interval régulié
setInterval(addPoints, process.env.TIMER_ADD_POINTS);

// Sauvegarder les points selon un interval régulié
setInterval(savePoints, process.env.SAVE_POINTS);
