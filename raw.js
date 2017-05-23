(
    (bot, config, RichEmbed, methods) => bot
        .on('ready', () => bot.user.setAvatar('./avatar.png').catch(() => { }) && bot.user.setGame(config.prefix + 'help') && bot.generateInvite(['MANAGE_MESSAGES']).then(console.log))
        .on('message', message => message.content.startsWith(config.prefix)
            && !message.author.bot
            && message.guild
            && ((command, args, store = {}) =>
                (
                    command === 'help' &&
                    message.delete() &&
                    message.author.send({
                        embed: new RichEmbed()
                            .addField(':book: Info', '`--help` - Shows this message\n`--info` - Shows info about the bot\n`--ping` - Pings the bot\n`--userinfo [@user]` - Shows info about you or another user'.replace(/--/g, config.prefix))
                            .addField(':tada: Fun', '`--cat` - Sends a random cat picture'.replace(/--/g, config.prefix))
                            .addField(':shield: Moderation', '`--purge` - Purges messages'.replace(/--/g, config.prefix))
                            .addField(':wrench: Utility', '`--eval` - Evaluates some JavaScript code'.replace(/--/g, config.prefix))
                    }).then(() => message.channel.send(':mailbox_with_mail: Sent you a DM with my commands.').then(m => m.delete(5000)))
                )
                ||
                (
                    command === 'info' &&
                    message.delete() &&
                    message.channel.send({
                        embed: new RichEmbed()
                            .setTitle('Hey!')
                            .setDescription(`My name is OneLine Bot! I\'m a Discord bot written entirely in a single line of code. :grin:\n\nFor a list of my commands, do \`${config.prefix}help\`.\n\n[GitHub](https://github.com/Rayzr522/OneLineBot) | [The line of code](https://github.com/Rayzr522/OneLineBot/blob/master/index.js)`)
                            .setThumbnail(bot.user.avatarURL)
                    }).then(m => m.delete(60000))
                )
                ||
                (
                    command === 'ping' &&
                    message.channel.send('Pong!')
                        .then(m => m.edit(`Pong! \`${m.createdTimestamp - message.createdTimestamp}ms\``) && m.delete(15000)))
                ||
                (
                    command === 'userinfo' &&
                    (store.member = message.mentions.members.first() || message.member) &&
                    message.delete().then(() => message.channel.send({
                        embed: new RichEmbed()
                            .addField('Name', store.member.user.tag, true)
                            .addField('Nickname', store.member.nickname || 'None', true)
                            .addField('ID', store.member.user.id, true)
                            .addField('Join Date', store.member.joinedAt.toLocaleString(), true)
                            .addField('Roles', store.member.roles.array().slice(1).sort((a, b) => b.position - a.position).map(role => role.name).join(', ') || 'None')
                            .setThumbnail(store.member.user.avatarURL)
                            .setColor(store.member.displayColor)
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
                ||
                (
                    command === 'purge' &&
                    (message.member.hasPermission('MANAGE_MESSAGES') ||
                        message.channel.send(':x: You do not have permission to do that!') && false
                    ) &&
                    (!isNaN(args[0]) ||
                        message.channel.send(':x: You must provide a number of messages to purge') && false
                    ) &&
                    (parseInt(args[0]) > 1 ||
                        message.channel.send(':x: You must provide a number greater than 1') && false
                    ) &&
                    message.delete()
                        .then(() => message.channel.bulkDelete(Math.min(parseInt(args[0]), 100))
                            .then(() => message.channel.send(`Purged ${Math.min(parseInt(args[0]), 100)} messages. :flame:`)
                                .then(m => m.delete(5000))))
                )
                ||
                (
                    command === 'cat' &&
                    methods.get('http://random.cat/meow').then(res => message.channel.send({ file: JSON.parse(res).file })) &&
                    message.delete()
                )
            )(message.content.substr(config.prefix.length).split(' ')[0], message.content.substr(config.prefix.length).split(' ').slice(1))
        ).login(config.token)
)(new (require('discord.js')).Client(), require('./config'), require('discord.js').RichEmbed, {
    get: input => new Promise((resolve, reject) =>
        require(
            require('url').parse(input).protocol.replace(/:/g, '')
        ).get(
            require('url').parse(input), res =>
                (buffer =>
                    res.on('data', chunk => buffer = Buffer.concat([buffer, chunk]))
                        .on('end', () => resolve(buffer.toString()))
                        .on('error', err => reject(err))
                )(Buffer.alloc(0))
            )
    )
}) && (
    () => process.on('unhandledRejection', console.error).on('uncaughtException', console.error)
)();