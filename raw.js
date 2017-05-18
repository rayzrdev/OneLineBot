(
    (bot, config, RichEmbed) => bot
        .on('ready', () => bot.user.setGame(config.prefix + 'help') && bot.generateInvite(['MANAGE_MESSAGES']).then(console.log))
        .on('message', message => message.content.startsWith(config.prefix)
            && !message.author.bot
            && message.guild
            && ((command, args) =>
                (
                    command === 'help' &&
                    message.delete() &&
                    message.author.send('**Commands:**\n`--ping` - Pings the bot\n`--info` - Shows info about your account\n`--eval` - Evaluates some JavaScript code'.replace(/--/g, config.prefix))
                        .then(() => message.channel.send(':mailbox_with_mail: Sent you a DM with my commands.').then(m => m.delete(5000)))
                )
                ||
                (
                    command === 'ping' &&
                    message.channel.send('Pong!')
                        .then(m => m.edit(`Pong! \`${m.createdTimestamp - message.createdTimestamp}ms\``)))
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
                ||
                (
                    command === 'eval' &&
                    (message.member.hasPermission('ADMINISTRATOR') ||
                        message.channel.send(':x: You do not have permission to do that!') && false
                    ) &&
                    (args.length > 0 ||
                        message.channel.send(':x: Please provide some code to eval!') && false
                    ) &&
                    message.channel.send(`\`\`\`xl\n${require('util').inspect(eval(args.join(' '))).substr(0, 1500)}\n\`\`\``)
                )
            )(message.content.substr(config.prefix.length).split(' ')[0], message.content.substr(config.prefix.length).split(' ').slice(1))
        ).login(config.token)
)(new (require('discord.js')).Client(), require('./config'), require('discord.js').RichEmbed) && (
    () => process.on('unhandledRejection', console.error).on('uncaughtException', console.error)
)();