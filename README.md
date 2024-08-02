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

CHANNEL = x  # la chaîne twitch ou le bot va
BROADCASTER_ID =
REFRESH_TOKEN_BROADCASTER =
CODE_BROADCASTER =

BOT_ID = 1119604558
REFRESH_TOKEN_BOT =
CODE_BOT =


#RAFFLE WIN RATIO
RAFFLE_WIN_RATIO = 33
```

.env.development

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.dev.json

TIMER_RAFFLE =
TIMER_ADD_POINTS =

TIMEOUT_BASE_COST =
```

.env.production

```ruby
LIVE_REQUIERED = true
POINTS_JSON = points.json

TIMER_RAFFLE =
TIMER_ADD_POINTS =

TIMEOUT_BASE_COST =
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

- commande pour voir les points
- commande pour voir les points de tout le monde
- commande pour voir les commandes 🙂 (et leurs prix)
- commande pour voir les commandes version modo
- Tous les mecs d'une couleur aléatoire qui appartient à Twitch (ex : rouge) sont timeout 60 secondes(au pif) --> perdes des points (quand y'en aura)
- Même chose qu'au dessus avec les badges
- Timeout des gens contre des points
- Voler des points aux autres/Payer pour faire perdre (payer plus que la cible n'en perde)
- Enlever/Devenir vip
- Roulette de points (Ouverture avec une chance aléatoire de gagner pour doubler sa mise)
- Demander au bot de lancer un raffle (avec un temps d'attente) la valeur varie entre un min et un max

## TODO List

1. Changer les systèmes de points par un tableau d'objets au lieu d'un objet d'objets et modifier la fonction activeRevenu et le reste en conséquence
2. Voir la doc pour les points
3. Voir pour mongoDb
4. Tout changer en TS
5. Revoir les tests
