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
import { startRaffle, cancelRaffle, joinRaffle } from './functions/raffle.js';
import { timeout } from './functions/timeout.js';
import { getOauthToken } from './services/auth.js';

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

client.on('message', async (channel, tags, message, self) => {
  // Le bot ne répond pas à lui-même
  if (self) return;

  // Si le spectateur n'est pas déjà suivi par le systeme de point, l'ajoute
  checkViewers(tags);
  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');
  // Lorsqu'une personne écrit !raffle
  if (message.startsWith('!raffle')) await startRaffle(client, tags, message.toLowerCase());
  if (message.startsWith('!cancel')) cancelRaffle(client, tags);
  if (message.startsWith('!join')) joinRaffle(tags);

  if (message.startsWith('!timeout'))
    timeout(client, channel, tags, message.toLowerCase().replace(letterNumber, ''));

  if (!checkCooldown(tags['user-id'])) {
    checkForPourquoi(client, channel, trunkMessage, tags);
    checkForQuoi(client, channel, trunkMessage, tags);
    checkForQui(client, channel, trunkMessage, tags);
  }
});

// Ajouter des points selon un interval régulié
setInterval(activeRevenue, process.env.TIMER_ADD_POINTS);
