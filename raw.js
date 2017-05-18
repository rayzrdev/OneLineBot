(
    (bot, config, RichEmbed) => bot
        .on('ready', () => bot.generateInvite(['MANAGE_MESSAGES']).then(console.log))
        .on('message', message => message.content.startsWith(config.prefix)
            && !message.author.bot
            && message.guild
            && ((command, args) =>
                (
                    command === 'ping' &&
                    message.channel.send('Pong!')
                        .then(m => m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`)))
                ||
                (
                    command === 'info' &&
                    message.delete().then(() => message.channel.send({
                        embed: new RichEmbed()
                            .addField('Name', message.author.tag)
                            .addField('ID', message.author.id)
                            .addField('Roles', message.member.roles.array().slice(1).sort((a, b) => b.position - a.position).map(role => role.name).join(', ') || 'None')
                            .setThumbnail(message.author.avatarURL)
                    }))
                )
            )(message.content.substr(config.prefix.length).split(' ')[0], message.content.substr(config.prefix.length).split(' ').slice(1))
        ).login(config.token)
)(new (require('discord.js')).Client(), require('./config'), require('discord.js').RichEmbed) && (
    () => process.on('unhandledRejection', console.error).on('uncaughtException', console.error)
)();