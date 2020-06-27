const { WebhookClient } = require('discord.js');
const { logEmbed } = require('../../modules/embeds.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = {
    name: 'clearBigs',
    description: 'Clears all big brothers',
    args: false,
    adminOnly: true,
    guildOnly: true,
    category: 'moderation',
    async execute(message) {
        const guildMembers = (await message.guild.members.fetch()).filter(
            (member) => !member.user.bot
        );

        guildMembers.forEach((member) => {
            const bigRoles = member.roles.cache.filter(
                (role) =>
                    role.name.toLowerCase().includes('big brother') ||
                    role.name.toLowerCase().includes('bbc')
            );
            bigRoles.forEach((role) => member.roles.remove(role.id));
        });

        const logChannel = await getLogChannel(message.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(null, 'Initiate All')
                .setColor('#00d166')
                .setDescription('Successfully cleared the Big Brothers!');

            webhookClient.send({ embeds: [embed] });
        }
    },
};
