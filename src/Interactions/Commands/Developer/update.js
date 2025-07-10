const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const { getEmojis } = require("../../../Structures/Systems/Valorant/valorantStyle")

module.exports = {
    developer: true,
    data:  new SlashCommandBuilder()
    .setName("update")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Startet den Bot neu und läd dabei das neuste Update runter!"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        // Sendet die Nachricht
        await interaction.reply({
            content: "🔄️ Bot wird neu gestartet...",
            flags: [MessageFlags.Ephemeral]
        }).then(() => {
            // Stopt den Bot nach dem Senden der Nachricht!
            process.exit(0);
        })
    }
}