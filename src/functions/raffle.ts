// Import Fonctions
import { addPoints } from './points';
import { checkRole, roundNumber, shuffleArray, sleep, toBoolean } from './utils';

// Import Services
import { getLive } from '../services/auth';

// Import Type
import { RaffleEnjoyer, Tags } from '../types/types';

let raffleStatus: boolean = false;
let raffleParticipants: RaffleEnjoyer[] = [];
let numberRaffle = 0;

/**
 * Commencer un raffle
 * @param {Object} client Le client
 * @param {Object} tags Les données de l'utilisateur de la commande
 * @param {string | number} prize Le montant à envoyer dans le chat
 * @returns {void} affiche le noms de gagnants et ajoute les points ou un message de non-lieu
 */
export const startRaffle = async (
  client: any,
  tags: Tags,
  prize: string | number,
): Promise<void> => {
  if (raffleStatus) return; // Si un raffle est déjà en cours
  if (toBoolean(process.env.LIVE_REQUIERED as string)) {
    const isLive = await getLive();
    if (!isLive?.length) return;
  }
  if (checkRole(tags) === 0) return;

  // on crée un nouveau raffle donc on reset les participants
  raffleStatus = true;
  raffleParticipants = [];
  const amount = typeof prize === 'string' ? parseInt(prize) : prize;

  client.say(
    process.env.CHANNEL,
    `Un raffle de ${amount} est en cours! Tapez !join pour rejoindre!`,
  );

  await sleep(parseInt(process.env.TIMER_RAFFLE as string));
  numberRaffle++;
  // une fois le timer passé, si le raffle ne s'est pas fait cancel on le désactive
  // et on pick les gagnants
  if (!raffleStatus) return;
  raffleStatus = false;
  if (raffleParticipants.length <= 0) {
    client.say(process.env.CHANNEL, `Personne n'a rejoint le raffle Smoge`);
    return;
  }
  raffleParticipants = shuffleArray(raffleParticipants);
  const ratioWinner = Math.round(
    (raffleParticipants.length * parseInt(process.env.RAFFLE_WIN_RATIO as string)) / 100,
  )
    ? Math.round(
        (raffleParticipants.length * parseInt(process.env.RAFFLE_WIN_RATIO as string)) / 100,
      )
    : 1;

  const listWinner = raffleParticipants.slice(0, ratioWinner);
  const winnerNames = `${listWinner.map((winner) => {
    return winner.name;
  })}`;

  client.say(
    process.env.CHANNEL,
    `Gagnant${listWinner.length > 1 ? 's' : ''} du raffle : ${winnerNames.replaceAll(',', ' ')}`,
  );
  addPoints(listWinner, Math.ceil(amount / ratioWinner));
};

/**
 * Quand un utilisateur demande un raffle, le bot en lance un
 * @param {Object} client le client
 * @returns {Promise<void>} Ne retourne rien, start une raffle
 */
export const begForRaffle = async (client: any): Promise<void> => {
  const value = roundNumber(
    Math.random() *
      (Number(process.env.RANDOM_RAFFLE_MAX) - Number(process.env.RANDOM_RAFFLE_MIN)) +
      Number(process.env.RANDOM_RAFFLE_MIN),
  );
  const isLive = await getLive();
  if (!isLive?.length) return;

  const liveStartedAt = new Date(isLive[0].started_at);
  const now = new Date();
  const differenceInHour = Math.round((now.getTime() - liveStartedAt.getTime()) / 1000 / 60 / 60);

  if ((numberRaffle / differenceInHour) * 100 < parseInt(process.env.RAFFLE_RATIO_MIN as string)) {
    startRaffle(
      client,
      {
        mod: true,
        'user-id': 'begForRaffleFunction',
        username: '',
        id: '',
      },
      value,
    );
  }
};

/**
 * Fait une fausse annonce de raffle
 * @param {Object} client Le client
 * @param {Object} tags Les données de l'utilisateur de la commande
 * @param {string | number} prize Le montant à envoyer dans le chat
 * @returns {void}
 */
export const fakeRaffle = async (client: any, tags: Tags, prize: string | number) => {
  if (raffleStatus) return; // Si un raffle est déjà en cours
  if (toBoolean(process.env.LIVE_REQUIERED as string)) {
    const isLive = await getLive();
    if (!isLive?.length) return;
  }
  if (checkRole(tags) === 0) return;
  const amount = typeof prize === 'string' ? parseInt(prize) : prize;

  client.say(
    process.env.CHANNEL,
    `Un raffle de ${amount} est en cours! Tapez !join pour rejoindre!`,
  );
  await sleep(parseInt(process.env.TIMER_FAKE_RAFFLE as string));

  client.say(
    process.env.CHANNEL,
    `C'était un faux raffle PRANKEX`,
  );
};

/**
 * Rejoindre un raffle en cours
 * @param {Tags} tags Les données d'un utilisateur
 * @returns {void} mais ajoute les données de l'utilisateur dans la variable global raffleParticipants
 */
export const joinRaffle = (tags: Tags): void => {
  if (!raffleParticipants.find((user) => user.id === tags['user-id']))
    raffleParticipants.push({ id: tags['user-id'], name: tags.username });
};

/**
 * Annule un raffle en cours
 * @param {Object} client Le client
 * @param {Object} tags Les données d'un utilisateur
 * @returns {boolean | undefined} raffleStatus or undefined si la personne n'a pas les droits
 */
export const cancelRaffle = (client: any, tags: Tags): boolean | undefined => {
  if (checkRole(tags) > 0) {
    client.say(process.env.CHANNEL, 'Le raffle a été annulé. PRANKEX');
    raffleStatus = false;
    return raffleStatus;
  }
};

/**
 * Réinitialise la variable globale `raffleParticipants` à un tableau vide.
 * N'est utilisé que dans les fichiers test
 * @returns {void} Cette fonction ne retourne rien mais change la valeur d'une variable global
 */
export const resetRaffleParticipants = (): void => {
  raffleParticipants = [];
};

/**
 * Réinitialise la variable globale `raffleStatus` à false.
 * N'est utilisé que dans les fichiers test
 * @returns {void}
 */
export const resetRaffleStatus = (): void => {
  raffleStatus = false;
};

/**
 * Retourne les informations des participants au raffle en cours
 * N'est utilisé que dans les fichiers test
 * @returns {RaffleEnjoyer[]} raffleParticipants
 */
export const getRaffleParticipants = (): RaffleEnjoyer[] => {
  return raffleParticipants;
};

/**
 * Retourne le status du raffle
 * N'est utilisé que dans les fichiers test
 * @returns {boolean} raffleStatus
 */
export const getRaffleStatus = (): boolean => {
  return raffleStatus;
};
