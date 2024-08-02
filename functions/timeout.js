import { getViewer, getIdViewerByName, removePoints } from './points.js';
import { serviceTimeout } from '../services/timeout.js';
import { clearMessage, commandes } from './utils.js';
import { getUser } from '../services/utils.js';
import { serviceWhisper } from '../services/whisper.js';

// name1 = userToTimeout name2 = buyer
const timeoutResponses = [
  '<name2> a trahis la confiance de <name1>',
  "<name2> a renvoyé <name1> à l'état de sans-éclat.",
  "<name2> a payé <montant> pour que <name1> ne fasse plus parti de la commu. C'est sad. PRANKEX",
  'AHAHAH mange ton caca <name1> :index_pointing_at_the_viewer: :face_with_hand_over_mouth: - signé <name2>',
];

/**
 * Timeout un utilisateur
 * @param {Client} client client
 * @param {Object} tags Les données de l'utilisateur
 * @param {String} message Le message de l'utilisateur
 * @returns {void}
 */
export const timeout = async (client, channel, tags, message) => {
  const isNumber = /^[1-9]\d*$/; // que des nombres
  const buyer = [getViewer(tags['user-id'])];
  let textWhisper = '';

  // séparation des arguments et vérifications
  // TODO faire une fonction dynamique et réutilisable qui check les parametres de commandes (deux parametres un tableau avec les arguments et un autre pour les vérifier)
  const splitMessage = clearMessage(message).split(' ');
  if (typeof splitMessage[1] != 'string' || !isNumber.test(splitMessage[2]) || splitMessage[3]) {
    if (splitMessage.length === 1) {
      textWhisper = commandes(splitMessage[0]);
    } else {
      textWhisper =
        "Désolé, je n'ai pas compris la demande.\n Essayez celle-ci : !timeout pseudo durée(minutes) ex: !timeout tryllogy 1";
    }
    const responseWhisper = serviceWhisper(tags['user-id'], textWhisper);
    if (responseWhisper < 200 && responseWhisper >= 300) {
      client.reply(process.env.CHANNEL, textWhisper, tags.id);
    }
    return;
  }
  const time = Math.round(Number(splitMessage[2]));
  if (buyer[0].points < process.env.TIMEOUT_BASE_COST * time) {
    client.reply(channel, "Tu n'as pas assez de points. MONKE", tags.id);
    return;
  }
  const isViewerHere = getIdViewerByName(splitMessage[1]);
  let userToTimeout = {};
  if (!isViewerHere) {
    userToTimeout = await getUser(splitMessage[1]);
  } else {
    userToTimeout = [{ id: isViewerHere }];
  }

  const response = await serviceTimeout(userToTimeout[0]['id'], time * 60, tags.username);

  if (response === 400) {
    client.reply(channel, 'Cet utilisateur ne peut pas être timeout!', tags.id);
    return;
  } else if (response < 200 && response >= 300) {
    client.reply(channel, "Erreur lors de la demande à l'api", tags.id);
    return;
  }

  const cost = process.env.TIMEOUT_BASE_COST * time;
  client.say(channel, getRandomResponse(splitMessage[1], tags.username, cost));
  removePoints([{ id: tags['user-id'], name: tags.username }], cost);
};

/**
 * Retourne une phrase contenant les bons noms de utilisateurs associès à la requête
 * @param {string} userToTimeout Nom de la personne qui se fait timeout
 * @param {string} buyer Nom de la personne qui a acheté la récompense
 * @param {string} montant Nom de la personne qui a acheté la récompense
 * @returns {string} texte que le bot va renvoyer
 */
const getRandomResponse = (userToTimeout, buyer, montant) => {
  let response = timeoutResponses[Math.floor(Math.random() * timeoutResponses.length)];
  response = response
    .replace('<name1>', userToTimeout)
    .replace('<name2>', buyer)
    .replace('<montant>', montant ?? '');
  return response;
};
