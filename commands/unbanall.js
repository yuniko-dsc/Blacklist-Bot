const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "unbanall",
    description: "Debanni tous les utilisateurs banni du serveur.",
    aliases: ['unbanall'],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message  
     * @param {string} args 
    */
    async execute(client, message, args) {
        const bans = await message.guild.bans.fetch().catch(() => {});
        if (!bans || bans.size == 0) return message.channel.send("Aucun utilisateur n'est banni sur le serveur");

        bans.forEach(ban => message.guild.bans.remove(ban.user).catch(() => {}));
        message.channel.send(`**${bans.size}\`** utilisateurs ont été **debannis**`);

    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const bans = await interaction.guild.bans.fetch().catch(() => {});
        if (!bans || bans.size == 0) return interaction.reply({ content: "Aucun utilisateur n'est banni sur le serveur", flags: 64 });

        bans.forEach(ban => interaction.guild.bans.remove(ban.user).catch(() => {}));
        return interaction.reply({ content: `**${bans.size}** utilisateurs ont ete **debannis**.` });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}