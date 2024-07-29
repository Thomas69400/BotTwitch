import fs from 'fs';

let viewers = {};
// Charger les points lors du démarrage
fs.readFile('points.json', 'utf8', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // Le fichier n'existe pas, initialiser viewers à un objet vide
      console.log('Aucun fichier de points trouvé, initialisation à un objet vide.');
      viewers = {};
    } else {
      console.error('Erreur lors du chargement des points:', err);
    }
  } else {
    try {
      viewers = JSON.parse(data);
      console.log('Points chargés');
    } catch (jsonErr) {
      console.error("Erreur lors de l'analyse du fichier JSON:", jsonErr);
      viewers = {}; // Initialiser à un objet vide en cas d'erreur d'analyse
    }
  }
});

// Regarde si un viewer existe sinon lui attribue une Date lastActive
export const checkViewers = (tags) => {
  if (!viewers[tags['user-id']]) {
    viewers[tags['user-id']] = {
      points: 0,
      lastActive: new Date(),
    };
  } else {
    // Mettre à jour le temps de la dernière activité
    viewers[tags['user-id']].lastActive = new Date();
  }
};

// Ajoute des points aux viewers qui ont parlé dans les 5 dernières minutes
export const addPoints = () => {
  const now = new Date();

  for (const [data] of Object.entries(viewers)) {
    const timeDiff = (now - data.lastActive) / 1000 / 60; // Temps en minutes

    // Si le spectateur a été actif dans les 5 dernières minutes
    if (timeDiff < 5) {
      data.points += 10; // Par exemple, 10 points toutes les 5 minutes
    }
  }
};

// Sauvegarder les points dans un fichier
export const savePoints = () => {
  fs.writeFile('points.json', JSON.stringify(viewers, null, 2), (err) => {
    if (err) console.error('Erreur lors de la sauvegarde des points:', err);
    else console.log('Points sauvegardés');
  });
};
