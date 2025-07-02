require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Geschütze User vor Riat
const blockedUsers = [
  "380066508425920522"
];

// Hierbei handelt es sich um ein kurzes Troll Feature
// Bitte nicht ernst nehmen
// Discord Voice State Update Event
client.on('voiceStateUpdate', (oldState, newState) => {
    try {
        // Riat Discord ID
        const monitoredUserId = "1251534422885404718";

        // Prüft, ob es um Riat geht
        if (newState.member.id === monitoredUserId) {
            const channel = newState.channel;

            // Prüft, ob ein geschützer User den Channel joint
            const foundBlockedUser = channel.members.some(member =>
                blockedUsers.includes(member.id) && member.id !== monitoredUserId
            );

            // Riat ist mit einer schützen Person im Voice
            if (foundBlockedUser) {
                // Kickt Riat aus dem Voice Channel
                    newState.disconnect("ANTI RIAT VOICE SYSTEM");
            }
        }
    } catch (err) {
        // Keine Fehler ausgeben, DANKE!
    }
});


client.login(process.env.BOT_TOKEN);