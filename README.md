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

HELLO_EMOTE = monkeyLick
HELLO_MAX = 4
HELLO_PRIZE = 50
HELLO_DEBUFF = 10
```

.env.development

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.dev.json

TIMER_ADD_POINTS = x

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x
RAFFLE_RATIO_MIN = x
RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x

TIMEOUT_BASE_COST = x

VIP_BASE_COST = x

DUEL = x

ROULETTE_RATIO = x
```

.env.production

```ruby
LIVE_REQUIERED = true
POINTS_JSON = points.json

TIMER_ADD_POINTS = x

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x
RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x
RAFFLE_RATIO_MIN = x

TIMEOUT_BASE_COST = x

VIP_BASE_COST = x

DUEL = x

ROULETTE_RATIO = x
```

.env.test

```ruby
LIVE_REQUIERED = false
POINTS_JSON = points.test.json

TIMER_RAFFLE = x
TIMER_FAKE_RAFFLE = x
RANDOM_RAFFLE_MIN = x
RANDOM_RAFFLE_MAX = x
RAFFLE_RATIO_MIN = x

VIP_BASE_COST = x

DUEL = x

ROULETTE_RATIO = x
```

3. Créer les fichiers "points.json", "points.dev.json" et "points.test.json" avec les données suivantes :

```json
{}
```

4. Commande `npm run start` pour démarrer l'application
5. Commande `npm run dev` pour démarrer l'application via Nodemon et coder plus facilement
6. Stopper le serveur avec Control + C

- Pour lancer le bot via un script dès que vous lancez le stream :

1. Créez un fichier vide nommé "launch_stream.bat" pour Windows ou "launch_stream.sh" si vous êtes sur macOS ou Linux.
2. Téléchargez le plugin [Advanced Scene Switcher](https://github.com/WarmUpTill/SceneSwitcher/releases)
3. Allez dans l'onglet Outils de votre OBS et sélectionnez le plugin du même nom.
4. Créez une macro avec comme option : name:"Launch LytchiBot", "Si", "Diffusion en continu", "Démarrage de la diffusion en continu"
   "Exécuter" puis le chemin vers votre fichier launch_stream
5. Pour remplir votre fichier launch_stream, vous aurez besoin du chemin du fichier.
   Copiez simplement le chemin que vous avez donné à OBS (en enlevant le launch_stream!).

Pour Windows:

```bat
@echo off
REM Ouvrir un terminal et lancer la commande npm run start
start "" cmd /k "cd C:\Chemin\Vers\Ton\Projet && npm run start"
```

Pour Linux/Mac:

```sh
#!/bin/bash
# Ouvrir un terminal et lancer la commande npm run start
gnome-terminal -- bash -c "cd /Chemin/Vers/Ton/Projet && npm run start; exec bash"
```

## Concepts

- Commande pour voir les commandes 🙂 (et leurs prix) UPDATE AVEC TOUTES LES COMMANDES
- Commande pour voir les commandes version modo
- Tous les mecs d'une couleur aléatoire qui appartient à Twitch (ex : rouge) sont timeout 60 secondes(au pif) --> perdes des points (quand y'en aura)
- Même chose qu'au dessus avec les badges
- Voler des points aux autres/Payer pour faire perdre (payer plus que la cible n'en perde)
- Enlever/Devenir vip
- Roulette de points (Ouverture avec une chance aléatoire de gagner pour doubler sa mise)
- Le bot dit rien quand il est en cooldown
- Faire un système de duel entre les joueurs : ils peuvent parier x points et celui qui a le plus grand nombre gagne (choisi aléatoirement)

## TODO List

1. Voir la doc pour les points
2. Voir pour mongoDb
3. Tout changer en TS
4. Revoir les tests

## DONE

- Commande pour voir les points
- Commande pour voir les points de tout le monde
- Commande pour voir les commandes 🙂 (et leurs prix)
- Timeout des gens contre des points
- Demander au bot de lancer un raffle (avec un temps d'attente) la valeur varie entre un min et un max
