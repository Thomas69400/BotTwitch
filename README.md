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
BROADCASTER_ID = x
REFRESH_TOKEN_BROADCASTER = x
CODE_BROADCASTER = x

BOT_ID = 1119604558
REFRESH_TOKEN_BOT = x
CODE_BOT = x


#RAFFLE WIN RATIO
RAFFLE_WIN_RATIO = 33

POINT_NAME = x
```

.env.development

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.dev.json

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x

TIMER_ADD_POINTS = x
TIMEOUT_BASE_COST = x
RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x
VIP_BASE_COST = x
UNVIP_BASE_COST = x
RAFFLE_RATIO_MIN = x
```

.env.production

```ruby
LIVE_REQUIERED = true
POINTS_JSON = points.json

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x

TIMER_ADD_POINTS = x

TIMEOUT_BASE_COST = x
RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x
VIP_BASE_COST = x
UNVIP_BASE_COST = x
RAFFLE_RATIO_MIN = x
```

.env.test

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.test.json

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x

RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x
VIP_BASE_COST = x
UNVIP_BASE_COST = x
RAFFLE_RATIO_MIN = x
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
  - le bot dit rien quand il est en cooldown

## TODO List

1. Voir la doc pour les points
2. Voir pour mongoDb
3. Tout changer en TS
4. Revoir les tests
