(
    (bot, config, RichEmbed, methods) => bot
        .on('ready', () =>
            bot.user.setAvatar('./avatar.png').catch(() => { }) &&
            bot.user.setGame(config.prefix + 'help') &&
            bot.generateInvite(['MANAGE_MESSAGES']).then(invite => (bot.invite = invite) && console.log(invite)))
        .on('message', message =>
            message.content.startsWith(config.prefix) &&
            !message.author.bot &&
            message.guild &&
            ((command, args, store = {}) =>
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
                            .setDescription(`My name is OneLine Bot. I\'m a Discord bot written entirely in a single line of code!\n\nFor a list of my commands, do \`${config.prefix}help\`.\n\n\n[:confetti_ball: Invite me to your server!](${bot.invite})\n\n[:computer: The line of power! (My code)](https://github.com/Rayzr522/OneLineBot/blob/master/index.js)\n\n[:moneybag: Support me!](http://patreon.com/Rayzr522)\n\n[:speech_balloon: Chat with my owner!](https://discord.io/rayzrdevofficial)`)
                            .setThumbnail(bot.user.avatarURL)
                    }).then(m => m.delete(60000))
                )
                ||
                (
                    command === 'ping' &&
                    message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp}ms\``)
                        .then(m => m.delete(15000)))
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
                    (message.author.id === '138048234819026944' ||
                        message.channel.send(':x: Only my owner can do that!') && false
                    ) &&
                    (args.length > 0 ||
                        message.channel.send(':x: Please provide some code to eval!') && false
                    ) &&
                    new Promise(_ => _(eval(args.join(' '))))
                        .then(output => message.channel.send(`\`\`\`xl\n${require('util').inspect(output).substr(0, 1500)}\n\`\`\``))
                        .catch(error => message.channel.send(`:x: \`${error}\``))
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
                    message.delete() &&
                    methods.get('http://random.cat/meow')
                        .then(res =>
                            new Promise(_ => _(JSON.parse(res).file))
                                .then(url => message.channel.send({ embed: new RichEmbed().setImage(url) }))
                                .catch(err => message.channel.send(':x: Failed to retrieve catch picture'))
                        )
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
    () => process.on('unhandledRejection', err => process.env.DEV && console.error(err))
)();