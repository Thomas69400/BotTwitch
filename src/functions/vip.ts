// Import types
import { Tags } from '../types/types';
import { User } from '../types/service.types';

// Import Services
import { serviceVip } from '../services/vip';
import { getUser } from '../services/utils';

// Import Functions
import { liveAndRight, clearMessage, handleStatusError } from './utils';
import { getViewer, getIdViewerByName, removePoints } from './points';

/**
 * Met le status VIP à un viewer
 * @param {Object} client client
 * @param {Tags} tags Les données de l'utilisateur
 * @param {string} message Le message de l'utilisateur (contient éventuellement le nom d'un viewer)
 * @return {Promise<void>} Reply dans le chat
 */
export const vip = async (
  client: any,
  channel: string,
  tags: Tags,
  message: string,
): Promise<void> => {
  const unvipRegex = /!unvip/;
  if (!(await liveAndRight(false))) return;
  const viewer = getViewer(tags['user-id']);
  if (viewer.points < Number(process.env.VIP_BASE_COST)) {
    client.reply(
      channel,
      `Tu n'as pas les ${process.env.POINT_NAME} nécessaires ! (coute ${process.env.VIP_BASE_COST} ${process.env.POINT_NAME})`,
      tags.id,
    );
    return;
  }
  let name;
  let vipOrUnvip;
  let replyMessage;
  if (unvipRegex.test(message)) {
    vipOrUnvip = false;
    name = clearMessage(message.replace('!unvip', ''));
    replyMessage = `${name} n'est plus V.I.P le gros loser !`;
  } else {
    vipOrUnvip = true;
    name = clearMessage(message.replace('!vip', ''));
    replyMessage = `${name} est devenu un membre V.I.P !`;
  }
  let idToVip: number;
  const isViewerHere = getIdViewerByName(name);
  if (name.length <= 0) {
    idToVip = parseInt(viewer.id);
  } else if (isViewerHere) {
    idToVip = parseInt(isViewerHere);
  } else {
    const user: User[] | undefined = await getUser(name);
    if (!user || user.length === 0) {
      client.reply(channel, "Cet utilisateur n'existe pas.", tags.id);
      return;
    } else {
      idToVip = parseInt(user[0].id);
    }
  }
  const responseVip = await serviceVip(idToVip, vipOrUnvip);
  if (responseVip !== 204) {
    handleStatusError(responseVip, client, channel, tags.id);
    return;
  }
  const cost = parseInt(process.env.VIP_BASE_COST as string);
  client.say(channel, replyMessage);
  removePoints([{ id: tags['user-id'] }], cost);
};
