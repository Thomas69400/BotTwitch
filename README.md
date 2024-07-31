# Bot Twitch

## Description

Bot Twitch pour gérer des messages, des commandes et un système de points avancé

## Fonctionnalités

1. Commandes twitch (raffles....)
2. Gérer les points

## Installation

1. Lancer avec `npm i` dans le terminal
2. Créer les fichiers .env avec les données suivantes :

.env :

```ruby
CLIENTID = x # L'id Client (dev.twitch.tv)
SECRET = x # Le Secret (dev.twitch.tv)
TOKEN_OAUTH = x # token récupéré via l'oauth Twitch
CHANNEL = x  # la chaîne twitch ou le bot va

# Timers: valeur en millisecondes
TIMER_ADD_POINTS = 10000
SAVE_POINTS = 10000

RAFFLE_WIN_RATIO =
BROADCASTER_ID = 644753700
BOT_ID = 1119604558
```

.env.development

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.dev.json
TIMER_RAFFLE =
```

.env.production

```ruby
LIVE_REQUIERED = true
POINTS_JSON = points.json
TIMER_RAFFLE =
```

.env.test

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.test.json
TIMER_RAFFLE =
```

3. Créer les fichiers "points.json", "points.dev.json" et "points.test.json" avec les données suivantes :

```json
{}
```

4. Commande `npm run start` pour démarrer l'application
5. Commande `npm run dev` pour démarrer l'application via Nodemon et coder plus facilement
6. Stopper le serveur avec Control + C

## Concepts

- Tous les mecs d'une couleur aléatoire qui appartient à Twitch (ex : rouge) sont timeout 60 secondes(au pif) --> perdes des points (quand y'en aura)
- Même chose qu'au dessus avec les badges
- Timeout des gens contre des points
- Voler des points aux autres/Payer pour faire perdre (payer plus que la cible n'en perde)
- Voler/Enlever/Devenir vip
- Roulette de points (Ouverture avec une chance aléatoire de gagner pour doubler sa mise)

## TODO List

1. Changer les systèmes de points par un tableau d'objets au lieu d'un objet d'objets et modifier la fonction activeRevenu et le reste en conséquence
2. Voir la doc pour les points
3. Voir pour mongoDb
4. Tout changer en TS
5. Revoir les tests
