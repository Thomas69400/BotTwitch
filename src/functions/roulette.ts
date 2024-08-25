//Import Functions
import { addPoints, getViewer, removePoints } from "./points";
import { clearMessage, liveAndRight } from "./utils";

//Import Types
import { Tags } from "../types/types";

let rouletteStatus: boolean = false;
const amountRegex = /\D/g; // Tout sauf les chiffres

/**
 * Ouvre ou ferme la roulette et envoie un message dans le chat pour notifier du changement
 * @param {Object} client Le client
 * @param {Tags} tags Les données de l'utilisateur
 * @returns {void}
 */
export const changeRouletteStatus = async (client: any, tags: Tags) => {
    if (!(await liveAndRight(true, tags))) return;
    if(!rouletteStatus) {
        rouletteStatus = true;
        client.say(process.env.CHANNEL, `La roulette est OPEN !!! Popoga`);
    }
    else { 
        rouletteStatus = false
        client.say(process.env.CHANNEL, `La roulette est fermée. Smoge`);
    };
}

/**
 * Permet à un utilisateur de jouer à la roulette pour doubler sa mise ou tout perdre
 * @param {Object} client Le client
 * @param {Tags} tags Les données de l'utilisateur
 * @param {string} message Le message de l'utilisateur (contient les points misés)
 * @returns {void}
 */
export const playRoulette = (client: any, tags: Tags, message: string) => {
    if(!rouletteStatus) return;
    message = clearMessage(message.replaceAll("!gamble", ''));
    if(message.length <= 0) return;
    const viewer = getViewer(tags["user-id"]);
    let amount = 0;
    if(message === "all") amount = viewer.points;
    else amount = parseInt(message.replace(amountRegex, ''));
    if(viewer.points < amount) {
        client.reply(process.env.CHANNEL, `Tu ne peux pas gamble ${amount} ${process.env.POINT_NAME}`, tags.id); 
        return;
    }
    if(amount <= 0) {
        client.reply(process.env.CHANNEL, `Tu ne peux pas gamble ${amount} ${process.env.POINT_NAME}`, tags.id);
        return;
    };
    if(Math.random() <= parseInt(process.env.ROULETTE_RATIO as string) / 100) {
        addPoints([{id: viewer.id}], amount);
        client.say(process.env.CHANNEL, `${viewer.name} a doublé sa mise! BASED`);
    }
    else {
        removePoints([{id: viewer.id}], amount);
        client.say(process.env.CHANNEL, `${viewer.name} a perdu son gamble. Buratino`);
    }
}