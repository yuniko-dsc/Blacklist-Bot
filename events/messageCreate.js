const { Client, Message } = require('discord.js')

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client
     * @param {Message} message 
    */
    async execute(client, message) {
        if (!message.inGuild() || message.author.bot) return;

        if (client.db[message.author.id])
            return message.member.ban({ reason: client.db[message.author.id].reason }).catch(() => {});

        if (!message.content.startsWith(client.config.prefix)) return;

        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        if (!command || !command.execute) return;

        const isOwner = (client.config.owners || []).includes(message.author.id);
        const isBuyer = client.config.buyer && client.config.buyer === message.author.id;
        const isAdmin = isOwner || isBuyer;

        if (command.botBuyerOnly && !isBuyer) return;
        if (command.botOwnerOnly && !isAdmin) return;
        if (command.guildOwnerOnly && message.guild.ownerId != message.author.id && !isAdmin) return;

        if (command.permissions?.length) {
            const authorPerms = message.channel.permissionsFor(message.author) || message.member.permissions;
            if (!authorPerms.has(command.permissions) && !isAdmin)
                return message.reply("Vous n'avez pas les permissions nécessaires pour exécuter cette commande.").catch(() => {});
        };

        command.execute(client, message, args.join(" "));
        console.log("[CMD]", `${message.guild.name} | ${message.channel.name} | ${message.author.username} | ${command.name}`);
    }
}