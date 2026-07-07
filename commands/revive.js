const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "revive",
    description: "Unblacklist un utilisateur et le debanni des serveurs.",
    usage: '<user>',
    aliases: ['revive'],
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

        let unban = 0;
        let notban = 0;

        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.bans.remove(user);
                unban++
            } catch { notban++ }
        }

        delete client.db[user.id];
        client.saveDB();

        return message.channel.send(`**${user.displayName}** a ete unblacklist.\nIl a ete **debanni** de **${unban} serveurs**.\nIl n'a pas pu etre **debanni** de **${notban} serveurs**.`);

    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser('user');
        if (!client.db[user.id]) return interaction.reply({ content: `\`${user.displayName}\` n'est pas blacklist`, flags: 64 });

        let unban = 0;
        let notban = 0;
        await interaction.deferReply();

        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.bans.remove(user);
                unban++
            } catch { notban++ }
        }

        delete client.db[user.id];
        client.saveDB();

        return interaction.editReply({ content: `**${user.displayName}** a ete unblacklist.\nIl a ete **debanni** de **${unban} serveurs**.\nIl n'a pas pu etre **debanni** de **${notban} serveurs**.` });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName('user')
                    .setDescription("L'utilisateur a revive")
                    .setRequired(true)
            )
    }
}