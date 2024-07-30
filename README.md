# Bot Twitch

## Description

Bot Twitch pour gérer des messages, des commandes et un systeme de points avancé

## Fonctionnalités

1. Commandes twitch (raffles....)
2. Gérer les Tryllogex

## Installation

1. Lancer avec `nmp i` dans le terminal
2. Créer un fichier .env avec les données suivantes :

```ruby
CLIENTID = x # L'id Client (dev.twitch.tv)
SECRET = x # Le Secret (dev.twitch.tv)
TOKEN_OAUTH = x # token récupéré via l'oauth Twitch
CHANNEL = x  # la chaine twitch ou le bot va

# Timers: valeur en millisecondes
TIMER_ADD_POINTS = 10000
SAVE_POINTS = 10000
```

3. Créer un fichier "points.json" avec les données suivantes :

```json
{}
```

4. Commande `npm run start` pour démarrer l'application
5. Commande `npm run dev` pour démarrer l'application via Nodemon et coder plus facilement
6. Stoper le serveur avec Control + C

## Concepts

- Tous les mecs d'une couleur aléatoire qui appartient à twitch (ex : rouge) sont timeout 60 secondes(au pif) --> perdes des points (quand y'en aura)
- Même chose qu'au dessus avec les badges
- Timeout des gens contre des points
- Voler des points aux autres / Payer pour faire perdre (payer plus que la cible n'en perde)
- Voler/Enlever/Devenir vip
- Roulette de points (Ouverture avec une chance aléatoire de gagner pour doubler sa mise)

## TODO List

1. Faire des Tests...
2. Voir la doc pour les points
3. Voir pour mongoDb
4. Tout changer en TS
