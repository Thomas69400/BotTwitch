import { getSpecificViewers, getSpecificViewersByName } from './points.js';
import { getAccessToken } from '../auth.js';
import axios from 'axios';

export const timeout = async (client, channel, tags, message) => {
  // const accesToken = await getAccessToken();
  // const url = `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${process.env.BROADCASTER_ID}&moderator_id=${process.env.CODE}`;
  // const data = { data: { user_id: 158556880, duration: 5, reason: 'no reason' } };
  // const headers = {
  //   'Content-Type': 'application/json',
  //   Authorization: `Bearer ${accesToken}`,
  //   'Client-Id': process.env.CLIENTID,
  // };
  // try {
  //   const response = await axios.post(url, data, { headers });
  //   console.log(response);
  // } catch (error) {
  //   console.error('Error dans isNotOnLive:', error);
  // }
  // const timeoutRegex = /^!timeout\s+(\d+)\s+@?(\S+)$/;
  // if (!timeoutRegex.test(message)) {
  //   client.reply(channel, "Désolé, je n'ai pas compris la demande.", tags.id);
  //   return;
  // }
  // const viewerWantTimeout = getSpecificViewers(tags);
  // const match = message.match(timeoutRegex);
  // const time = Math.round(match[1]);
  // if (viewerWantTimeout.points < process.env.TIMEOUT_BASE_COST * time) {
  //   client.reply(channel, "Vous n'avez pas assez de points", tags.id);
  //   return;
  // }
  // const viewerToTimeout = getSpecificViewersByName(match[2]);
  //client.say(channel, `/timeout ${viewerToTimeout.name} ${time}`);
};
