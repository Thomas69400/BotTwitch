import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import route from './route.js'; // Assurez-vous que le chemin est correct
import tmi from 'tmi.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Utilisation du routeur importé
app.use('/', route);

server.listen(PORT, () => {
    console.log(`Serveur lancé sur le PORT ${PORT}`);
});

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'TryllogexBot',
		password: process.env.TOKEN,
	},
	channels: [ 'Tryllogy' ]
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
	}
});