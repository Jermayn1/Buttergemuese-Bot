require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

// Intents & Partials
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// Erstellt den Client
const client = new Client({
    intents: [ Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates ],
    partials: [ User, Message, GuildMember, ThreadMember ]
});

// Fügt die Config zum client hinzu
client.config = require("./config.json");

// Collections für Events, Commands, etc.
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

// Collections für weitere Systeme
client.sicherheit = new Collection();
client.automove = new Collection();

// Lädt den Event Händler
const { loadEvents } = require("./Structures/Handlers/eventHandler");
loadEvents(client);

client.login(process.env.BOT_TOKEN);