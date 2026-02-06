const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const axios = require("axios");

const ValorantLink = require("../../../Structures/Schemes/valorantLink");

module.exports = {
    data:  new SlashCommandBuilder()
    .setName("linkvalo")
    .setDescription("Verlinkt deinen Valorant Account zum Match Tracking")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption(opt => opt
        .setName("name")
        .setDescription("Valorant Name")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("tag")
        .setDescription("Valorant Tag")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("region")
        .setDescription("Region")
        .setRequired(true)
        .addChoices(
            { name: "EU", value: "eu" },
            { name: "NA", value: "na" },
            { name: "AP", value: "ap" },
            { name: "KR", value: "kr" }
    )),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const name = interaction.options.getString("name");
        const tag = interaction.options.getString("tag");
        const region = interaction.options.getString("region");

        try {
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`,
                {
                    headers: {
                    Authorization: process.env.HENRIK_API_KEY
                    }
                }
            )


            const puuid = res.data.data.puuid;

            await ValorantLink.findOneAndUpdate(
                { User: interaction.user.id },
                { Guild: interaction.guild.id,
                  PUUID: puuid,
                  Region: region },
                {
                    upsert: true
                }
            );

            const embed = new EmbedBuilder()
                .setColor(client.config.color.success)
                .setTitle("✅ Valorant Account verlinkt")
                .setDescription(`**${name}#${tag}** (${region.toUpperCase()}) wurde erfolgreich gespeichert`)
            
            interaction.reply({
                embeds: [embed],
                flags: [MessageFlags.Ephemeral]
            });
        }
        catch(error) {
            console.error(error);

            const embed = new EmbedBuilder()
                .setColor(client.config.color.success)
                .setDescription("❌ Account konnte nicht gefunden werden")

            interaction.reply({
                embeds: [embed],
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
}