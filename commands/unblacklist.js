const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "unblacklist",
    description: "Unblacklist un utilisateur.",
    usage: '<user>',
    aliases: ['unbl'],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message  
     * @param {string} args 
    */
    async execute(client, message, args) {
        const user = message.mentions.users.first() ||
                     client.users.cache.get(args[0]) ||
                     client.users.cache.find(u => u.displayName.toLowerCase().includes(args[0]?.toLowerCase())) ||
                     client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase())) ||
                     await client.users.fetch(args[0]).catch(() => { });

        if (!user || !args[0]) return message.channel.send(`Aucun utilisateur de trouve pour \`${args[0] ?? 'rien'}\``);
        if (!client.db[user.id]) return message.channel.send(`\`${user.displayName}\` n'est pas blacklist`);

        delete client.db[user.id];
        client.saveDB();

        return message.channel.send(`**${user.displayName}** a ete unblacklist.`);

    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser('user');
        if (!client.db[user.id]) return interaction.reply({ content: `\`${user.displayName}\` n'est pas blacklist`, flags: 64 });

        delete client.db[user.id];
        client.saveDB();

        return interaction.reply({ content: `**${user.displayName}** a ete unblacklist.` });

    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName('user')
                    .setDescription("L'utilisateur a unblacklist")
                    .setRequired(true)
            )
    }
}