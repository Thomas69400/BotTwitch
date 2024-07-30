import fs from 'fs';

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
      console.log('Points chargés');
    } catch (jsonErr) {
      console.error("Erreur lors de l'analyse du fichier JSON:", jsonErr);
    }
  }
});

// Regarde si un viewer existe sinon lui attribue une Date lastActive
export const checkViewers = (tags) => {
  if (!viewers[tags['user-id']]) {
    viewers[tags['user-id']] = {
      name: viewers[tags.username],
      points: 0,
      lastActive: new Date(),
    };
  } else {
    // Mettre à jour le temps de la dernière activité
    viewers[tags['user-id']].lastActive = new Date();
  }
};

// Ajoute des points aux viewers qui ont parlé dans les 5 dernières minutes
export const activeRevenue = () => {
  const now = new Date();

  for (const [data] of Object.entries(viewers)) {
    const timeDiff = (now - data.lastActive) / 1000 / 60; // Temps en minutes

    // Si le spectateur a été actif dans les 5 dernières minutes
    if (timeDiff < 5) {
      data.points += 10; // Par exemple, 10 points toutes les 5 minutes
    }
  }
};

// Ajouter des points
export const addPoints = (ids, points) => {
  ids.forEach((id) => {
    viewers[id] = {
      ...viewers[id],
      points: points + viewers[id].points,
    };
  });
};

// Sauvegarder les points dans un fichier
export const savePoints = () => {
  fs.writeFile('points.json', JSON.stringify(viewers, null, 2), (err) => {
    if (err) console.error('Erreur lors de la sauvegarde des points:', err);
  });
};
