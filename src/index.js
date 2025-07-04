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

// Collections für Events, Commands, etc.
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

// Lädt den Event Händler
const { loadEvents } = require("./Structures/Handlers/eventHandler");
loadEvents(client);

client.login(process.env.BOT_TOKEN);