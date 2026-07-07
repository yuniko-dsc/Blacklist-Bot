const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "blacklist",
    description: "Blacklist un utilisateur.",
    usage: '[user]',
    aliases: ['bl'],
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

        if (!args[0]) {
            let p0 = 0;
            let p1 = 10;
            let page = 1;

            const embed = {
                title: 'Utilisateurs Blacklist',
                color: 0xffffff,
                description: !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('◀')
                    .setStyle(2),

                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(2),
            );

            const msg = await message.channel.send({ embeds: [embed], components: Object.keys(client.db).length > p1 ? [row] : null })
            const collector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10 });

            collector.on('end', () => msg.edit({ components: [] }));
            collector.on('collect', async i => {
                i.deferUpdate();
                if (i.user.id !== message.author.id) return;

                switch (i.customId) {
                    case 'back':
                        if (page - 1 < 1) return;

                        p0 = p0 - 10;
                        p1 = p1 - 10;
                        page = page - 1

                        embed.description = !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
                        msg.edit({ embeds: [embed] });
                        break;

                    case 'next':
                        if (page + 1 > Math.ceil(Object.keys(client.db).length / 10)) return;

                        p0 = p0 + 10;
                        p1 = p1 + 10;
                        page++;

                        embed.description = !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
                        msg.edit({ embeds: [embed] });
                        break;
                }
            })

        }
        else {
            if (!user) return message.channel.send(`Aucun utilisateur de trouve pour \`${args[0] ?? 'rien'}\``);
            if (client.db[user.id]) return message.channel.send(`\`${user.displayName}\` est deja blacklist`);
            if (client.config.owners.includes(user.id)) return message.channel.send(`Vous ne pouvez pas blacklist un owner`);

            let banned = 0;
            let notban = 0;
            let reason = args[1] ? args.slice(1).join(' ') : 'Aucune raison fournie'
            for (const guild of client.guilds.cache.values()) {
                try {
                    await guild.bans.create(user, { reason });
                    banned++
                } catch { notban++ }
            }

            client.db[user.id] = { reason, date: Date.now(), authorId: message.author.id }
            client.saveDB();

            return message.channel.send(`**${user.displayName}** a ete blacklist.\nIl a ete **banni** de ${banned} serveurs.\nIl n'a pas pu etre banni de ${notban} serveurs.`);
        }
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie';

        if (!user) {
            let p0 = 0;
            let p1 = 10;
            let page = 1;

            const embed = {
                title: 'Utilisateurs Blacklist',
                color: 0xffffff,
                description: !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('◀')
                    .setStyle(2),

                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(2),
            );

            const msg = await interaction.reply({ embeds: [embed], components: Object.keys(client.db).length > p1 ? [row] : null })
            const collector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10 });

            collector.on('end', () => msg.edit({ components: [] }));
            collector.on('collect', async i => {
                i.deferUpdate();
                if (i.user.id !== interaction.user.id) return;

                switch (i.customId) {
                    case 'back':
                        if (page - 1 < 1) return;

                        p0 = p0 - 10;
                        p1 = p1 - 10;
                        page = page - 1

                        embed.description = !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
                        msg.edit({ embeds: [embed] });
                        break;

                    case 'next':
                        if (page + 1 > Math.ceil(Object.keys(client.db).length / 10)) return;

                        p0 = p0 + 10;
                        p1 = p1 + 10;
                        page++;

                        embed.description = !Object.keys(client.db).length ? 'Aucun' : Object.keys(client.db).map((r, i) => `\`${i + 1}\` - <@${r}> (\`${client.db[r].reason}\`)`).slice(p0, p1).join('\n')
                        msg.edit({ embeds: [embed] });
                        break;
                }
            })

        }
        else {
            if (client.db[user.id]) return interaction.reply({ content: `\`${user.displayName}\` est deja blacklist`, flags: 64 });
            if (client.config.owners.includes(user.id)) return interaction.reply({ content: `Vous ne pouvez pas blacklist un owner`, flags: 64 });

            let banned = 0;
            let notban = 0;
            await interaction.deferReply();
            
            for (const guild of client.guilds.cache.values()) {
                try {
                    await guild.bans.create(user, { reason });
                    banned++
                } catch { notban++ }
            }

            client.db[user.id] = { reason, date: Date.now(), authorId: interaction.user.id }
            client.saveDB();

            return interaction.editReply({ content: `**${user.displayName}** a ete blacklist.\nIl a ete **banni** de **${banned} serveurs**.\nIl n'a pas pu etre **banni** de **${notban} serveurs**.` });
        }
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName('user')
                    .setDescription("L'utilisateur a blacklist")
                    .setRequired(false)
            )
            .addStringOption(o =>
                o.setName('raison')
                    .setDescription("La raison du blacklist")
                    .setRequired(false)
            )
    }
}