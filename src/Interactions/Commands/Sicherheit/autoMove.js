// Importiert das Scheme
const autoMove = require("../../../Structures/Schemes/autoMove");

const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
module.exports = {
    data:  new SlashCommandBuilder()
    .setName("automove")
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .setDescription("Der User wird permanent hin und her geschoben, was ein Troll")
    .addUserOption((option) => option
        .setName("user")
        .setDescription("Benutzer welcher getrollt werden soll")
        .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser("user");

        const embed = new EmbedBuilder()
        .setColor(client.config.color.normal)

        // Der König himself darf nicht getrollt werden
        if (user.id == "380066508425920522" && interaction.user.id != "380066508425920522") return interaction.reply({
            embeds: [embed.setDescription("🤴 Jermayn ist zu MÄCHTIG!")],
            flags: [MessageFlags.Ephemeral]
        });

        // Prüft, ob es ein Eintrag gibt
        let data = await autoMove.findOne({
            Guild: interaction.guild.id,
            User: user.id
        });

        // Falls es noch kein DB Eintrag gibt
        if (!data) return data = await autoMove.create({
            Guild: interaction.guild.id,
            User: user.id,
            Enabled: true
        });
        // Toggelt von true auf false und umgekehrt
        else await data.updateOne({ "$set": { "Enabled": data.Enabled ? false : true }});

        embed.setDescription(`Das Auto-Move System wurde für ${user.username} ${data.Enabled ? "deaktiviert" : "aktiviert"}!`);

        interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral]
        });
    }
}