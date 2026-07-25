const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "unban",
    description: "Debanni un utilisateurs banni du serveur.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message  
     * @param {string} args 
    */
    async execute(client, message, args) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => {});
        if (!user || !args[0]) return message.channel.send(`Aucun utilisateur trouvé pour \`${args[0] || 'rien'}\``);

        await message.guild.bans.remove(user)
            .then(() => message.channel.send(`**${user.username}** a été **debanni**`))
            .catch(() => message.channel.send(`**${user.username}** n'est pas banni sur le serveur`));
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
            const user = interaction.options.getUser('user');
            if (!user) return interaction.reply({ content: "Utilisateur non trouvé", flags: 64 });

            await interaction.guild.bans.remove(user)
                .then(() => interaction.reply({ content: `**${user.username}** a été **debanni**`, flags: 64 }))
                .catch(() => interaction.reply({ content: `**${user.username}** n'est pas banni sur le serveur`, flags: 64 }));
        },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option.setName('user').setDescription('Utilisateur à debannir').setRequired(true));
    }
}