const { GuildMember, Client } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        if (member.id == "1251534422885404718") {
            // Riat automatisch vom Server kicken
            try {
                member.kick("Auf seinen Wunsch wird er automatisch gekickt! Riat's eigene entscheidung.")
            } catch(err) {
            }

            // Riat Role Feature
            const { giveRiatRole } = require("../../Structures/Systems/Sicherheit/antiRiatSystem");
            giveRiatRole(client);
            // Riat Name Feature
            const { giveRiatName } = require("../../Structures/Systems/Sicherheit/antiRiatSystem");
            giveRiatName();
        }
    }
}