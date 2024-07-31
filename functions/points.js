import fs from 'fs';
import { isNotOnLive } from '../auth.js';
import { toBoolean } from './utils.js';

let viewers = {};

// Charger les points lors du démarrage
fs.readFile('points.json', 'utf8', (err, data) => {
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

export const getViewers = () => {
  return viewers;
};

export const resetViewers = () => {
  viewers = {};
};

// Regarde si un viewer existe sinon lui attribue une Date lastActive
export const checkViewers = (tags) => {
  if (!viewers[tags['user-id']]) {
    viewers[tags['user-id']] = {
      name: tags.username,
      points: 0,
      lastActive: new Date(),
    };
  } else {
    // Mettre à jour le temps de la dernière activité
    viewers[tags['user-id']].lastActive = new Date();
  }
};

// Ajoute des points aux viewers qui ont parlé dans les 5 dernières minutes
export const activeRevenue = async () => {
  if (toBoolean(process.env.LIVE_REQUIERED)) if (await isNotOnLive()) return;

  const now = new Date();

  for (const [key, data] of Object.entries(viewers)) {
    const timeDiff = (now - new Date(data.lastActive)) / 1000 / 60; // Temps en minutes

    // Si le spectateur a été actif dans les 5 dernières minutes
    if (timeDiff < 5) {
      data.points += 10; // Par exemple, 10 points toutes les 5 minutes
    }
  }
  savePoints();
};

// Ajouter des points
/**
 *
 * @param {Tableau d'objet} winners
 * @param {string} points
 */
export const addPoints = (winners, points) => {
  winners.forEach((winner) => {
    const oldData = viewers[winner.id];
    viewers[winner.id] = {
      ...oldData,
      points: points + oldData.points,
    };
  });
  savePoints();
};

// Sauvegarder les points dans un fichier
export const savePoints = () => {
  fs.writeFile(process.env.POINTS_JSON, JSON.stringify(viewers, null, 2), (err) => {
    if (err) console.error('Erreur lors de la sauvegarde des points:', err);
  });
};

/**
 * Retourne un viewer avec ses points grâce à son tag
 * @param {Object} tags
 * @returns viewer
 */
export const getSpecificViewers = (tags) => {
  return viewers[tags['user-id']];
};

/**
 * Retourne un viewer avec ses points grâce à son nom
 * @param {string} name
 * @returns viewer
 */
export const getSpecificViewersByName = (name) => {
  for (const id in viewers) {
    if (viewers[id].name === name) {
      return viewers[id];
    }
  }
};
