import { getViewer, getIdViewerByName, removePoints } from './points.js';
import { serviceTimeout } from '../services/timeout.js';
import { clearMessage } from './utils.js';
import { getUser } from '../services/utils.js';
import { serviceWhisper } from '../services/whisper.js';

// name1 = userToTimeout name2 = buyer
const timeoutResponses = [
  '<name2> a trahis la confiance de <name1>.',
  "<name2> a renvoyé <name1> a l'état de sans-éclat.",
  "<name2> a payé <montant> pour qu'<name1> ne fasse plus parti de la commu. C'est sad. PRANKEX",
  'AHAHAH mange ton caca <name1> :index_pointing_at_the_viewer: :face_with_hand_over_mouth: - signé <name2>',
];
let userToTimeout = {};

/**
 * Timeout un utilisateur
 * @param {Client} client client
 * @param {Channel} channel channel
 * @param {Object} tags Les données de l'utilisateur
 * @param {String} message Le message de l'utilisateur
 * @returns
 */
export const timeout = async (client, channel, tags, message) => {
  const isNumber = /^[1-9]/;
  const splitMessage = clearMessage(message).split(' ');

  if (!isNumber.test(splitMessage[2]) || typeof splitMessage[1] != 'string' || splitMessage[3]) {
    const responseWhisper =
      "Désolé, je n'ai pas compris la demande.\n Essayez celle ci : !timeout pseudo durée ex: !timeout tryllogy 1";
    const responseServiceWhisper = await serviceWhisper(tags['user-id'], responseWhisper);
    if (responseServiceWhisper === 401) {
      client.reply(channel, responseWhisper, tags.id);
    }
    return;
  }

  const viewerWantTimeout = [getViewer(tags['user-id'])];
  const time = Math.round(Number(splitMessage[2]));
  const isViewerHere = getIdViewerByName(splitMessage[1]);

  if (!isViewerHere) {
    userToTimeout = await getUser(splitMessage[1]);
  } else {
    userToTimeout = [
      {
        id: isViewerHere,
      },
    ];
  }

  if (viewerWantTimeout.points < process.env.TIMEOUT_BASE_COST * time) {
    client.reply(channel, "Tu n'as pas assez de points. MONKE", tags.id);
    return;
  }

  const response = await serviceTimeout(userToTimeout[0]['id'], time * 60, tags.username);

  if (response === 400) {
    client.reply(channel, 'Cet utilisateur ne peut pas être timeout !', tags.id);
    return;
  }
  const cost = process.env.TIMEOUT_BASE_COST * time;
  client.say(process.env.CHANNEL, getRandomResponse(userToTimeout[0].login, tags.username, cost));
  removePoints([{ id: tags['user-id'], name: tags.username }], cost);
};

/**
 * Retourne une phrase contenant les bons noms de utilisateurs associès à la requête
 * @param {String} userToTimeout Nom de la personne qui se fait timeout
 * @param {String} buyer Nom de la personne qui a acheté la récompense
 * @returns String
 */
function getRandomResponse(userToTimeout, buyer, montant) {
  let response = timeoutResponses[Math.floor(Math.random() * timeoutResponses.length)];
  response = response
    .replace('<name1>', userToTimeout)
    .replace('<name2>', buyer)
    .replace('<montant>', montant ?? '');
  return response;
}
