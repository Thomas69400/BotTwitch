// Import DotEnv
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: process.env.CONFIG_PATH });

// Import Package
import tmi from 'tmi.js';

// Import Fonctions
import { activeRevenue, checkViewers, readFile } from './functions/points';
import { begForRaffle, cancelRaffle, joinRaffle, startRaffle } from './functions/raffle';
import { timeout } from './functions/timeout';
import { commandes } from './functions/utils';
import { checkForPourquoi, checkForQui, checkForQuoi } from './functions/whoWhyWhat';
import { getOauthToken } from './services/auth';

// Import Type
import { Tags } from './types/types';

async function initializeBot() {
  const oauthToken = await getOauthToken(true);
  if (!oauthToken) {
    console.error('Le jeton OAuth est manquant.');
    return; // On arrête l'initialisation du bot si le jeton OAuth est manquant
  }
  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username: 'LytchiBot',
      password: oauthToken,
    },
    channels: [process.env.CHANNEL as string], // on met as string pour s'assurer que c'est un string et pas undefined
  });
  if (!process.env.CHANNEL)
    console.log('probleme avec le .env.CHANNEL lancement de sur la chaîne par default');

  client.connect().catch(console.error);

  readFile();

  // Regex
  const onlyLetter = /[^a-z\s]/g;
  const letterNumber = /[^a-z1-9\s]/;
  const containtBeg = /\bbeg\b/i;
  const containtRaffle = /\braffle\b/i;
  const amountRegex = /\D/g; // Tout sauf les chiffres

  client.on('message', async (channel: string, tags: Tags, message: string, self: boolean) => {
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
    if (message.startsWith('!help')) client.say(process.env.CHANNEL as string, commandes());
    if (message.startsWith('!timeout'))
      timeout(client, channel, tags, message.toLowerCase().replace(letterNumber, ''));

    // Check For
    checkForPourquoi(client, channel, trunkMessage, tags);
    checkForQuoi(client, channel, trunkMessage, tags);
    checkForQui(client, channel, trunkMessage, tags);

    if (containtBeg.test(message) && containtRaffle.test(message)) {
      begForRaffle(client); // @Thomas69400 c'est bon ça ? il faut bien qu'un argument ?
    }
  });

  // Ajouter des points selon un interval régulié
  setInterval(activeRevenue, parseInt(process.env.TIMER_ADD_POINTS as string)); // on met as string pour s'assurer que c'est un string et pas undefined
}

initializeBot();
