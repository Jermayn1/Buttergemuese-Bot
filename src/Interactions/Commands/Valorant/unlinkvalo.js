const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

const ValorantLink = require("../../../Structures/Schemes/valorantLink");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlinkvalo")
        .setDescription("Entfernt die Verknüpfung deines Valorant Accounts")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const data = await ValorantLink.findOne({
            User: interaction.user.id
        });

        if (!data) {
            return interaction.reply({
                content: "❌ Du hast aktuell keinen verlinkten Valorant Account.",
                flags: [MessageFlags.Ephemeral]
            });
        }

        await ValorantLink.deleteOne({
            User: interaction.user.id
        });

        const embed = new EmbedBuilder()
            .setColor(client.config.color.success)
            .setTitle(`✅ Dein Valorant wurde erfolgreich entkoppelt`)

        interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    }
};