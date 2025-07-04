const { VoiceState, Client } = require("discord.js");

// Geschütze User vor Riat
const blockedUsers = [
  "380066508425920522" // Jermayn
];

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
    }
}