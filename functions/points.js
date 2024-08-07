// Import Package
import fs from 'fs';

// Import Services
import { getLive } from '../services/auth.js';

// Import Fonctions
import { toBoolean } from './utils.js';

let viewers = {};

/**
 * Charger les points lors du démarrage
 */
export const readFile = () => {
  fs.readFile(`${process.env.POINTS_JSON}`, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('Aucun fichier de points trouvé, initialisation à un objet vide.');
      } else {
        console.error('Erreur lors du chargement des points:', err);
      }
    } else {
      try {
        viewers = JSON.parse(data);
      } catch (jsonErr) {
        console.error("Erreur lors de l'analyse du fichier JSON:", jsonErr);
      }
    }
  });
};

/**
 * Regarde si un viewer existe sinon lui attribue une Date lastActive
 * @param {Object} tags Les données d'un utilisateur
 */
export const checkViewers = (tags) => {
  if (!viewers[tags['user-id']]) {
    viewers[tags['user-id']] = {
      id: tags['user-id'],
      name: tags.username,
      points: 0,
      lastActive: new Date(),
    };
  } else {
    // Mettre à jour le temps de la dernière activité
    viewers[tags['user-id']].lastActive = new Date();
  }
  savePoints();
};

/**
 * Ajoute des points aux viewers qui ont parlé dans les 5 dernières minutes
 * @returns
 */
export const activeRevenue = async () => {
  if (toBoolean(process.env.LIVE_REQUIERED)) if (await getLive()) return;
  const now = new Date();
  const activeViewers = [];

  Object.values(viewers).forEach((data) => {
    const timeDiff = (now - new Date(data.lastActive)) / 1000 / 60; // Temps en minutes

    // Si le spectateur a été actif dans les 5 dernières minutes
    if (timeDiff < 5) {
      activeViewers.push(data);
    }
  });
  addPoints(activeViewers, 10);
};

/**
 * Ajoute des points aux utilisateurs
 * @param {Object[]} winners Tableau d'objet des personnes qui gagnent des points. Doit contenir au moins id
 * @param {string} points les points gagnés
 */
export const addPoints = (winners, points) => {
  points = Number(points); // Convertir en nombre
  winners.forEach((winner) => {
    if (!viewers[winner.id]) {
      viewers[winner.id] = {
        id: winner.id,
        name: 'Unknown',
        points: points,
        lastActive: new Date(),
      };
    } else {
      const oldData = viewers[winner.id];
      viewers[winner.id] = {
        ...oldData,
        points: oldData.points + points,
      };
    }
  });
  savePoints();
};

/**
 * Retire des points aux utilisateurs
 * @param {Object[]} loser Tableau d'objet des personnes qui perdent des points. Doit contenir au moins id
 * @param {string} points le nombre de points perdus
 */
export const removePoints = (losers, points) => {
  points = Number(points); // Convertir en nombre
  losers.forEach((loser) => {
    if (!viewers[loser.id]) {
      viewers[loser.id] = {
        id: loser.id,
        name: 'Unknown',
        points: -points,
        lastActive: new Date(),
      };
    } else {
      const oldData = viewers[loser.id];
      viewers[loser.id] = {
        ...oldData,
        points: oldData.points - points,
      };
    }
  });
  savePoints();
};

/**
 * Sauvegarder les points dans un fichier
 */
export const savePoints = () => {
  fs.writeFile(process.env.POINTS_JSON, JSON.stringify(viewers, null, 2), (err) => {
    if (err) console.error('Erreur lors de la sauvegarde des points:', err);
  });
};

/**
 * Classe les viewers par points et les affiches dans le chat
 * @param {Object} client le client
 */
export const classement = (client) => {
  const arrayViewers = Object.values(viewers); // Convertir l'objet en un tableau de valeurs
  arrayViewers.sort((a, b) => b.points - a.points); // Trier le tableau en ordre décroissant de points
  let getFirstTenViewers = '';
  for (let index = 0; index < arrayViewers.length && index < 10; index++) {
    const element = arrayViewers[index];
    getFirstTenViewers += `#${index + 1} ${element.name} ${element.points} ${
      process.env.POINT_NAME
    } ${index < arrayViewers.length - 1 ? ';' : ''} `;
  }
  client.say(process.env.CHANNEL, getFirstTenViewers);
};

/**
 * Met un message dans le chat qui indique les points de l'utilisateur qui demande
 * @param {Object} client le client
 * @param {Object} tags Les données de l'utilisateur qui envoie le message
 * //TODO mettre en paramètre le message pour avoir les points d'un utilisateur qui n'est pas soit meme
 */
export const points = (client, tags) => {
  const askingViewer = getViewer(tags['user-id']);
  client.reply(
    process.env.CHANNEL,
    `Tu as ${askingViewer.points} ${process.env.POINT_NAME} !`,
    tags.id,
  );
};

/**
 * Retourne un viewer avec ses points grâce à son id
 * @param {number} id
 * @returns viewer
 */
export const getViewer = (id) => {
  return viewers[id];
};

/**
 * Retourne un viewer avec ses points grâce à son nom
 * @param {string} name
 * @returns viewer
 */
export const getIdViewerByName = (name) => {
  for (const id in viewers) {
    if (viewers[id].name === name) {
      return id;
    }
  }
};

/**
 * Réassign les valeurs des viewers
 * UNIQUEMENT UTILISER POUR LES TESTS
 * @param {Object} newValues Les viewers à réassigner
 * @returns {void}
 */
export const reassignViewers = (newValues) => {
  if (newValues) viewers = { ...newValues };
  else viewers = {};
};

/**
 * Retourne la liste des viewers
 * @returns {Object} l'objet contenant les viewers et leurs points
 */
export const getViewers = () => {
  return viewers;
};
