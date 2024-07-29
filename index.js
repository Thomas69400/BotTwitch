import dotenv from 'dotenv';
import tmi from 'tmi.js';

import { checkCooldown, checkForPourquoi, checkForQui, checkForQuoi } from './functions/whoWhyWhat.js';
import { savePoints, addPoints, checkViewers } from './functions/points.js';

dotenv.config();

// init
const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'LytchiBot',
    password: process.env.TOKEN,
  },
  channels: [process.env.CHANNEL],
});
client.connect().catch(console.error);

// Regex
const onlyLetter = /[^a-z\s]/g;

client.on('message', (channel, tags, message, self) => {
  // Ne répond pas à soit-même
  if (self) return;

  // Si le spectateur n'est pas déjà suivi, l'ajouter
  checkViewers(tags);

  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');

  checkCooldown();

  checkForPourquoi(client, channel, trunkMessage, tags);
  checkForQuoi(client, channel, trunkMessage, tags);
  checkForQui(client, channel, trunkMessage, tags);
});

// Ajouter des points toutes les 5 minutes
setInterval(addPoints, process.env.TIMER_ADD_POINTS);

// Sauvegarder les points toutes les heures
setInterval(savePoints, process.env.SAVA_POINTS);
