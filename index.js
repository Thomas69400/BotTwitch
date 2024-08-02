import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: process.env.CONFIG_PATH });
import tmi from 'tmi.js';

import {
  checkCooldown,
  checkForPourquoi,
  checkForQui,
  checkForQuoi,
} from './functions/whoWhyWhat.js';
import { activeRevenue, checkViewers, readFile } from './functions/points.js';
import { startRaffle, cancelRaffle, joinRaffle, begForRaffle } from './functions/raffle.js';
import { timeout } from './functions/timeout.js';
import { getOauthToken } from './services/auth.js';
import { allCommandes } from './functions/utils.js';

// Initialisation
const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'LytchiBot',
    password: getOauthToken(true),
  },
  channels: [process.env.CHANNEL],
});
client.connect().catch(console.error);
readFile();
// Regex
const onlyLetter = /[^a-z\s]/g;
const letterNumber = /[^a-z1-9\s]/;
const containsBeg = /\bbeg\b/i;
const containsRaffle = /\braffle\b/i;

client.on('message', async (channel, tags, message, self) => {
  // Si le spectateur n'est pas déjà suivi par le systeme de point, l'ajoute
  checkViewers(tags);
  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');
  // Lorsqu'une personne écrit !raffle
  if (message.startsWith('!raffle')) startRaffle(client, tags, message.toLowerCase());
  if (message.startsWith('!cancel') && !self) cancelRaffle(client, tags);
  if (message.startsWith('!join') && !self) joinRaffle(tags);
  if (message.startsWith('!cmd') && !self) allCommandes(client);
  if (containsBeg.test(message) && containsRaffle.test(message) && !self) {
    begForRaffle(client, tags, message);
  }
  if (message.startsWith('!timeout'))
    timeout(client, channel, tags, message.toLowerCase().replace(letterNumber, ''));
  if (!checkCooldown(tags['user-id']) && !self) {
    checkForPourquoi(client, channel, trunkMessage, tags);
    checkForQuoi(client, channel, trunkMessage, tags);
    checkForQui(client, channel, trunkMessage, tags);
  }
});

// Ajouter des points selon un interval régulié
setInterval(activeRevenue, process.env.TIMER_ADD_POINTS);
