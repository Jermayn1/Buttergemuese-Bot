require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Manager } = require('moonlink.js');

// Intents & Partials
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// Erstellt den Client
const client = new Client({
    intents: [ Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates ],
    partials: [ User, Message, GuildMember, ThreadMember ]
});

// Erstellt Moonlink Manager für das Musik System
const manager = new Manager({
    nodes: [
        {
        host: 'localhost',
        port: 2333,
        password: '',
        secure: false,
        },
    ],
    sendPayload: (guildId, payload) => {
        const guild = client.shard.send(JSON.parse(guildId));
        if (guild) guild.shard.send(JSON.parse(payload))
    },
});

// Fügt den Manager zum Client hinzu, damit man mit diesen leichter arbeiten kann
client.manager = manager;

// Fügt die Config zum client hinzu
client.config = require("./config.json");

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









// Provisiorisch die Moonlight Events. Die kommen später an ihren richtigen Ort
// Forward raw packets for voice updates
client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

// Handle node events
client.manager.on('nodeConnect', (node) => console.log(`Node ${node.identifier} connected!`));
client.manager.on('nodeError', (node, error) => console.error(`Node ${node.identifier} error:`, error));

// Example command to play a track (basic implementation)
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.startsWith('!play')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel!');

    const query = message.content.replace('!play', '').trim();
    if (!query) return message.reply('Please specify a song to play.');

    const player = client.manager.createPlayer({
      guildId: message.guild.id,
      voiceChannelId: voiceChannel.id,
      textChannelId: message.channel.id,
      autoPlay: true,
    });
    
    player.connect();
    
    const result = await client.manager.search({
      query
    });
    if (!result.tracks.length) return message.reply('No results found!');
    
    player.queue.add(result.tracks[0]);
    if (!player.playing) player.play();

    message.reply(`Added to queue: **${result.tracks[0].title}**`);
  }
});