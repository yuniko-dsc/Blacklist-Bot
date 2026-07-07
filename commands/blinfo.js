const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "blinfo",
    description: "Affiche les informations d'un utilisateur blacklist.",
    aliases: ['blacklistinfo'],
    usage: '<user>',
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

        await user.fetch();
        const embed = {
            title: `Informations de ${user.displayName}`,
            color: 0xffffff,
            description: `**Pseudo** - \`${user.displayName}\`
                          **ID** - \`${user.id}\` (${user})
                          
                          **Date de creation** - <t:${Math.round(user.createdTimestamp / 1000)}> <t:${Math.round(user.createdTimestamp / 1000)}:R> 
                          **Jours depuis la création** - \`${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\`
                          
                          **Avatar** - ${user.avatar ? `[\`Lien de l'Avatar\` ](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096)` : "\`Pas de photo de profile\`"}
                          **Banniere** - ${user.banner ? `[\`Lien de la Bannière\` ](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=4096)` : "\`Pas de bannière\`"}
                          
                          **Blacklist par** - \`${client.db[user.id].authorId}\` (<@${client.db[user.id].authorId}>)
                          **Blacklist** - <t:${Math.round(client.db[user.id].date / 1000)}> <t:${Math.round(client.db[user.id].date / 1000)}:R> 
                          **Blacklist pour** - \`${client.db[user.id].reason}\``.replaceAll('  ', '')
        }
        
        return message.channel.send({ embeds: [embed] });

    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser('user');
        if (!client.db[user.id]) return interaction.reply({ content: `\`${user.displayName}\` n'est pas blacklist`, flags: 64 });

        await user.fetch();
        const embed = {
            title: `Informations de ${user.displayName}`,
            color: 0xffffff,
            description: `**Pseudo** - \`${user.displayName}\`
                          **ID** - \`${user.id}\` (${user})
                          
                          **Date de creation** - <t:${Math.round(user.createdTimestamp / 1000)}> <t:${Math.round(user.createdTimestamp / 1000)}:R> 
                          **Jours depuis la création** - \`${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\`
                          
                          **Avatar** - ${user.avatar ? `[\`Lien de l'Avatar\` ](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096)` : "\`Pas de photo de profile\`"}
                          **Banniere** - ${user.banner ? `[\`Lien de la Bannière\` ](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=4096)` : "\`Pas de bannière\`"}
                          
                          **Blacklist par** - \`${client.db[user.id].authorId}\` (<@${client.db[user.id].authorId}>)
                          **Blacklist** - <t:${Math.round(client.db[user.id].date / 1000)}> <t:${Math.round(client.db[user.id].date / 1000)}:R> 
                          **Blacklist pour** - \`${client.db[user.id].reason}\``.replaceAll('  ', '')
        }
        
        return interaction.reply({ embeds: [embed] });

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