import { getSpecificViewers, getSpecificViewersByName } from './points.js';

export const timeout = (client, channel, tags, message) => {
  client
    .timeout('Tryllogy', 'HellBot01')
    .then((data) => {
      console.log(`mod executed:`, data);
    })
    .catch((err) => {
      console.error(`Error executing mod:`, err);
    });
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
