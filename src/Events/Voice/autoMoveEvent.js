const { VoiceState, Client } = require("discord.js");

const autoMove = require("../../Structures/Schemes/autoMove");

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     * @param {Client} client 
     */
    async execute(oldState, newState, client) {

        try {
            // Nur reagieren, wenn jemand einem Voice-Channel beitritt oder wechselt
            if (oldState.channelId === newState.channelId) return;

            const data = await autoMove.findOne({
                Guild: newState.guild.id,
                User: newState.member.id
            });

            if (!data || !data.Enabled) return;

            // Alle Sprachkanäle im Server holen
            const voiceChannels = newState.guild.channels.cache
                .filter(ch => ch.type === 2 && ch.id !== newState.channelId) // type 2 = GUILD_VOICE, und nicht der aktuelle Channel
                .map(ch => ch);

            if (voiceChannels.length === 0) return;

            // Zufälligen Channel auswählen
            const randomChannel = voiceChannels[Math.floor(Math.random() * voiceChannels.length)];

            // User verschieben
            await newState.setChannel(randomChannel).catch(() => {});
        } catch (err) {
            // Keine Fehler ausgeben, DANKE!
        }
    }
}