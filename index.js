import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import route from './route.js'; // Assurez-vous que le chemin est correct
import tmi from 'tmi.js';
import { log } from 'console';

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

const onlyLetter = /[^a-zA-Z\s]/g; //REGEX

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'LytchiBot',
		password: process.env.TOKEN,
	},
	channels: [ 'Tryllogy', 'Naitchi' ]
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {

	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
	}
	if(message.toLowerCase().replace(onlyLetter, "").search("quoi") !== -1) {
	 	var words = message.toLowerCase().replace(onlyLetter, "").split(' ');
		words = words.filter(word => {if (word.length > 0) return word; });
		words.reverse();
		if(words[0] === "quoi") { client.say(channel, `FEUR !`) };
	}
	if(message.toLowerCase().replace(onlyLetter, "").search("pourquoi") !== -1) {
		var words = message.toLowerCase().replace(onlyLetter, "").split(' ');
	   words = words.filter(word => {if (word.length > 0) return word; });
	   words.reverse();
	   if(words[0] === "pourquoi") { client.say(channel, `Il me semble que c'est bien pour feur @${tags.username}. Buratino`) };
   }
});