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
            // Riat Role Feature
            const { giveRiatRole } = require("../../Structures/Systems/Riat/riatFeature");
            giveRiatRole(client);
            // Riat Name Feature
            const { giveRiatName } = require("../../Structures/Systems/Riat/riatFeature");
            giveRiatName();
        }
    }
}