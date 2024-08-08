// Import Fonctions
import { getIdViewerByName, getViewer, removePoints } from './points';
import { clearMessage, commandes } from './utils';

// Import Services
import { serviceTimeout } from '../services/timeout';
import { getUser } from '../services/utils';
import { serviceWhisper } from '../services/whisper';

// Import Type
import { Tags } from '../types/types';
import { User } from '../types/service.types';

// name1 = userToTimeout name2 = buyer
const timeoutResponses = [
  '<name2> a trahi la confiance de <name1>',
  "<name2> a renvoyé <name1> à l'état de sans-éclat.",
  "<name2> a payé <montant> pour que <name1> ne fasse plus parti de la commu. C'est sad. PRANKEX",
  'AHAHAH mange ton caca <name1> :index_pointing_at_the_viewer: :face_with_hand_over_mouth: - signé <name2>',
];

/**
 * Timeout un utilisateur
 * @param {Object} client client
 * @param {Tags} tags Les données de l'utilisateur
 * @param {string} message Le message de l'utilisateur
 * @returns {Promise<void>}
 */
export const timeout = async (
  client: any,
  channel: string,
  tags: Tags,
  message: string,
): Promise<void> => {
  const isNumber = /^[1-9]\d*$/; // que des nombres
  const buyer = [getViewer(tags['user-id'])];
  let textWhisper = '';

  // Séparation des arguments et vérifications
  const splitMessage = clearMessage(message).split(' ');
  if (typeof splitMessage[1] != 'string' || !isNumber.test(splitMessage[2]) || splitMessage[3]) {
    if (splitMessage.length === 1) {
      textWhisper = commandes(splitMessage[0]);
    } else {
      textWhisper =
        "Désolé, je n'ai pas compris la demande.\n Essayez celle-ci : !timeout pseudo durée(minutes) ex: !timeout tryllogy 1";
    }
    const responseWhisper = await serviceWhisper(tags['user-id'], textWhisper);
    if (responseWhisper !== 204) {
      handleTimeoutError(responseWhisper, client, channel, tags.id);
    }
    return;
  }
  const time = Math.round(Number(splitMessage[2]));
  if (buyer[0].points < parseInt(process.env.TIMEOUT_BASE_COST as string) * time) {
    client.reply(channel, "Tu n'as pas assez de points. MONKE", tags.id);
    return;
  }

  let userToTimeout: number;
  const isViewerHere = getIdViewerByName(splitMessage[1]);
  if (isViewerHere) userToTimeout = parseInt(isViewerHere);
  else {
    const user: User[] | undefined = await getUser(splitMessage[1]);
    if (!user || user.length === 0) {
      client.reply(channel, "Cet utilisateur n'existe pas.", tags.id);
      return;
    } else {
      userToTimeout = parseInt(user[0].id);
    }
  }
  // TODO s'assurer que cette merde marche
  const responseTimeout = await serviceTimeout(userToTimeout, time * 60, tags.username);

  if (responseTimeout !== 200) {
    handleTimeoutError(responseTimeout, client, channel, tags.id);
    return;
  }

  const cost = parseInt(process.env.TIMEOUT_BASE_COST as string) * time;
  client.say(channel, getRandomResponse(splitMessage[1], tags.username, cost));
  removePoints([{ id: tags['user-id'] }], cost);
};

/**
 * Retourne une phrase contenant les bons noms de utilisateurs associès à la requête
 * @param {string} userToTimeout Nom de la personne qui se fait timeout
 * @param {string} buyer Nom de la personne qui a acheté la récompense
 * @param {string} [prize] optionnel Nom de la personne qui a acheté la récompense
 * @returns {string} texte que le bot va renvoyer
 */
const getRandomResponse = (
  userToTimeout: string,
  buyer: string,
  prize?: string | number,
): string => {
  const amount = prize !== undefined ? String(prize) : ''; // TODO s'assurer que cette merde marche
  let response = timeoutResponses[Math.floor(Math.random() * timeoutResponses.length)];
  response = response
    .replace('<name1>', userToTimeout)
    .replace('<name2>', buyer)
    .replace('<montant>', amount);
  return response;
};

/**
 * Fonction pour gérer les erreurs de timeout
 * @param {number} status le status de la requête
 * @param {Object} client le client
 * @param {Object} channel le channel
 * @param {string} replyId l'id de la personne qui reçoit la réponse
 */
const handleTimeoutError = (status: number, client: any, channel: string, replyId: string) => {
  if (status === 400) {
    client.reply(channel, 'Cet utilisateur ne peut pas être timeout!', replyId);
  } else if (status < 200 || status >= 300) {
    client.reply(channel, "Erreur lors de la demande à l'api", replyId);
  }
};
