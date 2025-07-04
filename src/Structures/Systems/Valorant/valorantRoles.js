const { Client, ButtonInteraction, MessageFlags, EmbedBuilder } = require("discord.js")

/**
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 * @param {String} role 
 * @returns 
 */
function toggleRole(interaction, client, roleStr) {
    const { member, guild } = interaction;

    let roleId = null;

    // Prüft welche Rolle gewählt wurde
    switch(roleStr) {
        case "Duelist": 
            roleId = "1390742845366997183";
        break;
        case "Initiator": 
            roleId = "1390742947359752222";
        break;
        case "Sentinel":
            roleId = "1390743003055783956";
        break;
        case "Controller":
            roleId = "1390743039110156318";
        break;
    }

    // Falls keiner der Rollen durch den Funktions aufruf geben sollte
    if (!roleId) return interaction.reply({
       content: `🤔 This role doesn't exist! Role: ${roleStr}. Please contact <@380066508425920522> for assistance.`,
       ephemeral: true
    });

    // Entimmt die Rolle vom Discord Server
    const role = guild.roles.cache.get(roleId);

    // Prüft ob es die Rolle auf dem Server gibt
    if (!role) return interaction.reply({
       content: `🤔 This role doesn't exist! Role: ${roleId}. Please contact <@380066508425920522> for assistance.`,
       ephemeral: true
    });

    // Embed vorlage
    const Embed = new EmbedBuilder()
    .setColor(client.config.color.valorant)
    .setTimestamp()
    .setFooter({ text: "Buttergemüse • Role System"});

    try {
        // Fügt den Member die Rolle hinzu bzw. entfernt diese
        if (member.roles.cache.has(role.id)) {
            Embed
            .setTitle('✅ Role Removed')
            .setDescription(`You have been successfully removed from the role ${role}.`)
            member.roles.remove(role.id);
        } else {
            Embed
            .setTitle('✅ Role Added')
            .setDescription(`You have been successfully given the role ${role}!`)
            member.roles.add(role.id);
        }
    } catch (error) {
        Embed.setTitle("😕 Oops! There Was a Problem")
        .setDescription(`Something went wrong while trying to managing your roles. Role ${role}. Please try again later or contact <@380066508425920522>.`);
    }

    // Gibt eine Antwort zurück
    interaction.reply({
        embeds: [Embed],
        flags: [MessageFlags.Ephemeral]
    })
}

module.exports = {
    toggleRole
};