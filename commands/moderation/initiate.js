const { logEmbed } = require('../../modules/embeds.js');
const { WebhookClient } = require('discord.js');
const { getLogChannel, getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'initiate',
    description: 'Promotes the user to an Active',
    args: true,
    usage: '<user (tag or id)>',
    adminOnly: true,
    guildOnly: true,
    category: 'moderation',
    async execute(message, args) {
        const rawId = args[0];
        const userId = rawId.replace('<@!', '').replace('>', '');
        if (isNaN(userId)) return message.reply('Please tag the user or provide their user id');

        const member = await message.guild.members.fetch(userId);

        const roles = await getRoles(member.client);
        if (!roles.associate) {
            return await message.reply('Please set the Associate role!');
        }

        if (!roles.active) {
            return await message.reply('Please set the Active role!');
        }

        if (!member.roles.cache.has(roles.associate.Id)) {
            return await message.reply(`<@!${userId}> is not an associate, therefore cannot be initiated`);
        }

        await member.roles.add(roles.active.Id);
        await member.roles.remove(roles.associate.Id);

        await member.send({
            embed: {
                title: 'Congratulations you have been Initiated!',
                color: 0x00d166,
                description: 'The Active role has been assigned to you!\n\n' + ``,
            },
        });

        const logChannel = await getLogChannel(member.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(logChannel.Id, logChannel.token);
            const embed = logEmbed(member, 'Initiated').addFields(
                {
                    name: 'User',
                    value: `<@!${member.id}>`,
                    inline: true,
                },
                {
                    name: 'Initiated by',
                    value: `<@!${message.author.id}>`,
                    inline: true,
                }
            );
            webhookClient.send({ embeds: [embed] });
        }
    },
};
