// Import Types
import { Tags, ShortViewer } from '../types/types';

//Import Functions
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
    const viewer = getViewer(tags['user-id']);
    if(viewer.points < parseInt(process.env.DUEL as string)) {
        client.reply(process.env.CHANNEL, `T'as pas les thunes mon grand.`, tags.id);
        return;
    }
    if(isDuelActive) {
        if (!duelViewers.find((user) => user.id === tags['user-id'])) duelViewers.push({ id: tags['user-id'], name: tags.username });
        removePoints([{id: viewer.id}], parseInt(process.env.DUEL as string));
        if (duelViewers.length != 2) return;
        const result = Math.floor(Math.random() * 10);
        let winner = 0;
        let loser = 1;
        if(result > 5) {winner = 1; loser = 0};
        addPoints([{id: duelViewers[winner].id}], parseInt(process.env.DUEL as string) * 2);
        client.say(process.env.CHANNEL, `${duelViewers[winner].name} a gagné le duel contre ${duelViewers[loser].name} et remporte ${process.env.DUEL} ${process.env.POINT_NAME}`);
        isDuelActive = false;
    }
    else {
        isDuelActive = true;
        duelViewers = [];
        client.say(process.env.CHANNEL, `Un duel est en cours! Tape !duel pour défier ${tags.username} et tenter de remporter ${process.env.DUEL} ${process.env.POINT_NAME}.`)
        duel(client, tags);
    }
};