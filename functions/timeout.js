import { getViewer, getIdViewerByName, removePoints } from './points.js';
import { serviceTimeout } from '../services/timeout.js';
import { clearMessage } from './utils.js';

export const timeout = async (client, channel, tags, message) => {
  const isNumber = /^[1-9]/;
  const splitMessage = clearMessage(message).split(' ');
  if (!isNumber.test(splitMessage[1]) || typeof splitMessage[2] != 'string' || splitMessage[3]) {
    client.whisper(tags.username, "Désolé, je n'ai pas compris la demande.");
    return;
  }
  const viewerWantTimeout = getViewer(tags);
  const time = Math.round(Number(splitMessage[1]));
  if (viewerWantTimeout.points < process.env.TIMEOUT_BASE_COST * time) {
    client.reply(channel, "Tu n'as pas assez de points. MONKE", tags.id);
    return;
  }
  removePoints(
    [{ id: tags['user-id'], name: viewerWantTimeout.username }],
    process.env.TIMEOUT_BASE_COST * time,
  );
  const viewerToTimeout = getIdViewerByName(splitMessage[2]);
  serviceTimeout(viewerToTimeout, time * 60, tags.username);
};
