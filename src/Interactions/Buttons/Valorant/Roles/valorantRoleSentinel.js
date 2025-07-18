const { ButtonInteraction, Client } = require("discord.js");
const { toggleRole } = require("../../../../Structures/Systems/Valorant/valorantRoles");

module.exports = {
    id: "valorantRoleSentinel",
    /**
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        toggleRole(interaction, client, "Sentinel")
    }
}