// Import Types
import { Tags, ShortViewer } from '../types/types';
import { addPoints, getViewer, removePoints } from './points';

let duelViewers: Array<ShortViewer> = [];
let isDuelActive: boolean = false;

/**
 * Lance un duel contre 2 utilisateurs pour parier x points (x étant la valeur définie dans le env)
 * @param {Object} client le client
 * @param {Object} tags Les données de l'utilisateur de la commande
 * @returns {void} affiche le nom di gagnant et échange les points entre les 2 joueurs
 */
export const duel = (client: any, tags: Tags):void => {
    if(isDuelActive) {
        const viewerPoints = getViewer(tags['user-id']).points;
        if(viewerPoints < parseInt(process.env.DUEL as string)) {
            client.reply(process.env.CHANNEL, `T'as pas le thunes mon grand.`, tags.id);
        }
        if (!duelViewers.find((user) => user.id === tags['user-id'])) duelViewers.push({ id: tags['user-id'], name: tags.username });
        if (duelViewers.length != 2) return;
        const result = Math.floor(Math.random() * 10);
        if(result <= 5) {
            addPoints([{id: duelViewers[0].id}], parseInt(process.env.DUEL as string));
            removePoints([{id: duelViewers[1].id}], parseInt(process.env.DUEL as string));
            client.say(process.env.CHANNEL, `${duelViewers[0].name} a gagné le duel contre ${duelViewers[1].name} et remporte ${process.env.DUEL} ${process.env.POINT_NAME}`);
        } 
        else {
            addPoints([{id: duelViewers[1].id}], parseInt(process.env.DUEL as string));
            removePoints([{id: duelViewers[0].id}], parseInt(process.env.DUEL as string));
            client.say(process.env.CHANNEL, `${duelViewers[1].name} a gagné le duel contre ${duelViewers[0].name} et remporte ${process.env.DUEL} ${process.env.POINT_NAME}`);
        }
        isDuelActive = false;
    }
    else {
        isDuelActive = true;
        duelViewers = [];
        client.say(process.env.CHANNEL, `Un duel est en cours! Tape !duel pour défier ${tags.username} et tenter de remporter ${process.env.DUEL} ${process.env.POINT_NAME}.`)
        duel(client, tags);
    }
};