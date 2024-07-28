import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import route from './route.js';
import tmi from 'tmi.js';
import { randomInt } from 'crypto';
import { convertWords } from './functions.js';

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
		username: 'LytchiBot',
		password: process.env.TOKEN,
	},
	channels: [ process.env.CHANNEL ]
});
client.connect().catch(console.error);

const userCooldowns = {}; // Object to store the last response times for users
const COOLDOWN_TIME = 10 * 60 * 1000; // 5 minutes in milliseconds
const quoiRegex = /\bqu?o+i+\b/g; // REGEX regarde si "quoi" avec plusieurs "i"
const pourquoiRegex = /\bpourqu?o+i+\b/g; // REGEX regarde si "pourquoi" avec plusieurs "i"
const quiRegex = /\bqu?i+\b/g; // REGEX regarde si "pourquoi" avec plusieurs "i"
const onlyLetter = /[^a-z\s]/g; // REGEX prend que les lettres et les espaces
const responsesPourquoi = [
	`Tout simplement pour feur Pepega Pepega`,
	`Pour feur :joy: :rofl: :rofl:`,
	`Peut-être bien que c'est pour coubeh !`,
	`Il me semble que c'est bien pour feur. Buratino`
];
const responsesQuoi = [
	`FEUR !!!!!`,
	`Feur (coiffeur tu l'as ou pas ^^ ?)`
];
const responsesQui = [
	'Quette ou bien kette tel est la question :thinking:',
	"C'est quette MonkeySpin"
];

client.on('message', (channel, tags, message, self) => {
	if(self) return;
	console.log(tags);
	const trunkMessage = message.toLowerCase().replace(onlyLetter, "");
	// CD pour pas que le bot spam les quette et feur
	const checkCooldown = (user) => {
		const now = Date.now();
		if (!userCooldowns[user]) {
			userCooldowns[user] = now;
			return false; // No cooldown in effect
		}
		const lastResponseTime = userCooldowns[user];
		if (now - lastResponseTime > COOLDOWN_TIME) {
			userCooldowns[user] = now;
			return false; // Cooldown period has passed
		}
		return true; // Cooldown in effect
	};
	// Répondre FEUR en fin de phrase après un 'pourquoi'
	if(trunkMessage.replace(pourquoiRegex, 'pourquoi').search("pourquoi") !== -1) {
	 	let words = trunkMessage.replace(pourquoiRegex, 'pourquoi').split(' ');
		words = convertWords(words);
		if(words[0] === 'pourquoi') {
			if (!checkCooldown(tags.username)) {
				client.reply(channel, responsesPourquoi[randomInt(responsesPourquoi.length)], tags.id);
			}
		};
	}
	// Répondre FEUR après un 'quoi' en fin de phrase
	if(trunkMessage.replace(quoiRegex, 'quoi').search("quoi") !== -1) {
	 	let words = trunkMessage.replace(quoiRegex, 'quoi').split(' ');
		words = convertWords(words);
		if(words[0] === "quoi") { 
			if (!checkCooldown(tags.username)) {
				client.reply(channel, responsesQuoi[randomInt(responsesQuoi.length)], tags.id);
			}
		};
	}
	// Répondre Quette en fin de phrase après un 'qui'
	if(trunkMessage.replace(quiRegex, 'quoi').search("quoi") !== -1) {
	 	let words = trunkMessage.replace(quiRegex, 'qui').split(' ');
		words = convertWords(words);
		if(words[0] === "qui") { 
			if (!checkCooldown(tags.username)) {
				client.reply(channel, responsesQui[randomInt(responsesQui.length)], tags.id);
			}
		};
	}
});