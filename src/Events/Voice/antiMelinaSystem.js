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
            // Anti Melina System
            const channel = newState.channel;
            const monitoredUserId = "1166455819223703703";

            // Prüft, ob es um Riat geht
            if (newState.member.id === monitoredUserId) {

                // Prüft, ob ein geschützer User den Channel joint
                const foundBlockedUser = channel.members.some(member =>
                    blockedUsers.includes(member.id) && member.id !== monitoredUserId
                );

                // Melina ist mit einer schützen Person im Voice
                if (foundBlockedUser) {
                    // Kickt Melina aus dem Voice Channel
                    // DISABLED
                    return
                    newState.disconnect("ANTI MELINA VOICE SYSTEM");
                }
            }
        } catch (err) {
            // Keine Fehler ausgeben, DANKE!
        }
    }
}