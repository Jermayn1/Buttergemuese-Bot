const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { getEmojis } = require("../../../Structures/Systems/Valorant/valorantStyle")

module.exports = {
    data:  new SlashCommandBuilder()
    .setName("valorantroleselect")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Erstellt die Valorant Role Select Message"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        // Embed Vorlage
        const Embed = new EmbedBuilder()
        .setColor(client.config.color.valorant)
        .setImage(client.config.valorant_assets.pick_your_playstyle);

        // Emojis entnehmen für die Buttons
        const emojis = await getEmojis();

        // Buttons Vorlage
        const duelistBtn = new ButtonBuilder()
        .setLabel("Duelist")
        .setCustomId("valorantRoleDuelist")
        .setEmoji(emojis.duelist)
        .setStyle(ButtonStyle.Secondary);

        const initiatorBtn = new ButtonBuilder()
        .setLabel("Initiator")
        .setCustomId("valorantRoleInitiator")
        .setEmoji(emojis.initiator)
        .setStyle(ButtonStyle.Secondary);

        const sentinelBtn = new ButtonBuilder()
        .setLabel("Sentinel")
        .setCustomId("valorantRoleSentinel")
        .setEmoji(emojis.sentinel)
        .setStyle(ButtonStyle.Secondary);

        const controllerBtn = new ButtonBuilder()
        .setLabel("Controller")
        .setCustomId("valorantRoleController")
        .setEmoji(emojis.duelist)
        .setStyle(ButtonStyle.Secondary);

        // Erstellt die Reinfolge der Buttons
        const row1 = new ActionRowBuilder()
        .addComponents(duelistBtn, initiatorBtn, sentinelBtn, controllerBtn);

        // Gibt die Nachricht aus
        interaction.reply({
            content: "",
            ephemeral: true,
            embeds: [Embed],
            components: [row1]
        });
    }
}