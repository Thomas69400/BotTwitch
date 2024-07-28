import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import tmi from 'tmi.js';

import { checkCooldown, checkForPourquoi, checkForQui, checkForQuoi } from './functions.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

server.listen(PORT, () => {
  console.log(`Bot lancé sur le port: ${PORT}`);
});

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'LytchiBot',
    password: process.env.TOKEN,
  },
  channels: [process.env.CHANNEL],
});
client.connect().catch(console.error);

// Regex
const onlyLetter = /[^a-z\s]/g;

client.on('message', (channel, tags, message, self) => {
  // Ne répond pas à soit-même
  if (self) return;

  // Supprime tout les caractères spéciaux
  const trunkMessage = message.toLowerCase().replace(onlyLetter, '');

  checkCooldown();

  checkForPourquoi(client, channel, trunkMessage, tags);
  checkForQuoi(client, channel, trunkMessage, tags);
  checkForQui(client, channel, trunkMessage, tags);
});
