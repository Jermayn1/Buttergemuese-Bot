const { GuildMember, Client } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        // Riat Role Feature
        const { giveRiatRole } = require("../../Structures/Functions/riatFeature");
        giveRiatRole(client);
    }
}