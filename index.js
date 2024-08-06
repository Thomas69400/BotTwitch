// Import DotEnv
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: process.env.CONFIG_PATH });

// Import Package
import tmi from 'tmi.js';

// Import Fonctions
import { activeRevenue, checkViewers, readFile } from './functions/points.js';
import { begForRaffle, cancelRaffle, joinRaffle, startRaffle } from './functions/raffle.js';
import { timeout } from './functions/timeout.js';
import { commandes } from './functions/utils.js';
import { checkForPourquoi, checkForQui, checkForQuoi } from './functions/whoWhyWhat.js';
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
const containtBeg = /\bbeg\b/i;
const containtRaffle = /\braffle\b/i;
const amountRegex = /\D/g; // Tout sauf les chiffres

client.on('message', async (channel, tags, message, self) => {
  // Le bot ne répond pas à lui-même
  if (self) return;

  // Si le spectateur n'est pas déjà suivi par le systeme de point, on l'ajoute
  checkViewers(tags);

  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');

  // Fonctions
  if (message.startsWith('!raffle')) startRaffle(client, tags, message.replace(amountRegex, ''));
  if (message.startsWith('!cancel')) cancelRaffle(client, tags);
  if (message.startsWith('!join')) joinRaffle(tags);
  if (message.startsWith('!help')) client.say(process.env.CHANNEL, commandes());
  if (message.startsWith('!timeout'))
    timeout(client, channel, tags, message.toLowerCase().replace(letterNumber, ''));

  // Check For
  checkForPourquoi(client, channel, trunkMessage, tags);
  checkForQuoi(client, channel, trunkMessage, tags);
  checkForQui(client, channel, trunkMessage, tags);

  if (containtBeg.test(message) && containtRaffle.test(message)) {
    begForRaffle(client, tags, message);
  }
});

// Ajouter des points selon un interval régulié
setInterval(activeRevenue, process.env.TIMER_ADD_POINTS);
