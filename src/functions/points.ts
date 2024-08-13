// Import Package
import fs from 'fs';

// Import Fonctions
import { clearMessage, liveAndRight } from './utils';

// Import Types
import { Tags, Viewer, Viewers } from '../types/types';

let viewers: Viewers = {};

/**
 * Charger les points lors du démarrage
 */
export const readFile = (): void => {
  fs.readFile(`${process.env.POINTS_JSON}`, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('Aucun fichier de points trouvé, initialisation à un objet vide.');
      } else {
        console.error('Erreur lors du chargement des points:', err);
      }
    } else {
      try {
        const parsedData: Viewers = JSON.parse(data);

        // ça reconvertit les lastActive strings du JSON en type Date (ça existe pas en json en gros)
        // TODO voir si c'est utile de changer ça quand on passe dans une base de données
        viewers = Object.fromEntries(
          Object.entries(parsedData).map(([id, viewer]) => [
            id,
            {
              ...viewer,
              lastActive:
                typeof viewer.lastActive === 'string'
                  ? new Date(viewer.lastActive)
                  : viewer.lastActive,
            },
          ]),
        );
      } catch (jsonErr) {
        console.error("Erreur lors de l'analyse du fichier JSON:", jsonErr);
      }
    }
  });
};

/**
 * Regarde si un viewer existe sinon lui attribue une Date lastActive
 * @param {Tags} tags Les données d'un utilisateur
 * @returns {void}
 */
export const checkViewers = (tags: Tags): void => {
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
 * @returns {Promise<void>}
 */
export const activeRevenue = async (): Promise<void> => {
  if (!(await liveAndRight(false))) return;

  const now = new Date();
  const activeViewers: Viewer[] = [];

  Object.values(viewers).forEach((viewer) => {
    if (!(viewer.lastActive instanceof Date)) {
      throw new Error('Invalid lastActive property. It should be an instance of Date.');
    }
    const timeDiff = (now.getTime() - viewer.lastActive.getTime()) / 1000 / 60; // Temps en minutes

    // Si le spectateur a été actif dans les 5 dernières minutes
    if (timeDiff < 5) {
      activeViewers.push(viewer);
    }
  });
  if (activeViewers.length > 0) addPoints(activeViewers, 10);
};

/**
 * Ajoute des points aux utilisateurs
 * @param { { id: string }[]} winners Tableau d'objet des personnes qui gagnent des points. Doit contenir au moins id
 * @param {string | number} prize les points gagnés
 * @returns {void}
 */
export const addPoints = (winners: { id: string }[], prize: string | number): void => {
  const points = Number(prize); // Convertir en Nombre
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
 * @param {{ id: string }[]} losers Tableau d'objet des personnes qui perdent des points. Doit contenir au moins id
 * @param {string | number} prize le nombre de points perdus
 * @returns {void}
 */
export const removePoints = (losers: { id: string }[], prize: string | number): void => {
  const points = Number(prize); // Convertir en Nombre
  losers.forEach((loser) => {
    if (!viewers[loser.id]) {
      viewers[loser.id] = {
        id: loser.id,
        name: 'Unknown', // TODO y'a un probleme la non ?????
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
 * @returns {void}
 */
export const savePoints = (): void => {
  fs.writeFile(process.env.POINTS_JSON as string, JSON.stringify(viewers, null, 2), (err) => {
    if (err) console.error('Erreur lors de la sauvegarde des points:', err);
  });
};

/**
 * Classe les viewers par points et les affiches dans le chat
 * @param {any} client le client
 * @returns {void} renvoie un message dans le chat
 */
export const classement = (client: any): void => {
  // Convertir l'objet en un tableau de valeurs et supprime les bots (lytchi en a 2 (le compte et l'application))
  const arrayViewers = Object.values(viewers).filter((viewer) => {
    if (viewer.name !== 'Unknown' && viewer.name !== 'lytchibot' && viewer.name !== 'nightbot')
      return viewer;
  });

  const viewersInTop = Math.min(9, arrayViewers.length - 1);

  arrayViewers.sort((a, b) => b.points - a.points); // Trier le tableau en ordre décroissant de points

  let firstTenViewers = '';
  for (let i = 0; i < arrayViewers.length && i < 10; i++) {
    const viewer = arrayViewers[i];
    firstTenViewers += `#${i + 1} ${viewer.name} ${viewer.points} ${process.env.POINT_NAME}${
      i === viewersInTop ? '' : ' ; '
    }`;
  }
  client.say(process.env.CHANNEL, firstTenViewers.trim());
};

/**
 * Met un message dans le chat qui indique les points de l'utilisateur qui demande
 * @param {any} client le client
 * @param {Tags} tags Les données de l'utilisateur qui envoie le message
 * @param {string} message Le message que l'utilisateur envoie
 * @returns {void} envoie un message dans le chat mais la fonction en elle meme ne renvoie rien
 */
export const tellPoints = (client: any, tags: Tags, message: string): void => {
  const username = clearMessage(message.replace('!points', '').trim());
  let reply = '';
  if (typeof username === 'string' && username.length > 0) {
    const viewerId = getIdViewerByName(username);
    if (viewerId) {
      const askingViewer: Viewer = getViewer(viewerId);
      if (askingViewer) {
        reply = `${askingViewer.name} a ${askingViewer.points} ${process.env.POINT_NAME} !`;
      } else {
        reply = `Je n'ai pas trouvé de points pour l'utilisateur ${username}.`;
      }
    } else {
      reply = `Je n'ai pas trouvé de points pour l'utilisateur ${username}.`;
    }
  } else {
    const askingViewer: Viewer = getViewer(tags['user-id']);
    if (askingViewer) {
      reply = `Tu as ${askingViewer.points} ${process.env.POINT_NAME} !`;
    } else {
      reply = "Je n'ai pas trouvé tes points.";
    }
  }
  client.reply(process.env.CHANNEL, reply, tags.id);
};

/**
 * Retourne un viewer avec ses points grâce à son id
 * @param {string} id
 * @returns {Viewer}
 */
export const getViewer = (id: string): Viewer => {
  return viewers[id];
};

/**
 * Retourne un viewer avec ses points grâce à son nom
 * @param {string} name
 * @returns {string | undefined} id
 */
export const getIdViewerByName = (name: string): string | undefined => {
  for (const id in viewers) {
    if (viewers[id].name === name) {
      return id;
    }
  }
};

/**
 * Réassign les valeurs des viewers
 * UNIQUEMENT UTILISER POUR LES TESTS
 * @param {Viewers} newValues Les viewers à réassigner
 * @returns {void}
 */
export const reassignViewers = (newValues?: Viewers): void => {
  if (newValues) viewers = { ...newValues };
  else viewers = {};
};

/**
 * Retourne la liste des viewers
 * @returns {Viewers} l'objet contenant les viewers et leurs points
 */
export const getViewers = (): Viewers => {
  return viewers;
};
