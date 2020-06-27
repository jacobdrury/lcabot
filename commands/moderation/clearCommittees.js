const { WebhookClient } = require('discord.js');
const { logEmbed } = require('../../modules/embeds.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = {
    name: 'clearCommittees',
    description: 'Clears all committee roles from users',
    args: false,
    adminOnly: true,
    guildOnly: true,
    category: 'moderation',
    aliases: ['cc'],
    async execute(message) {
        const guildMembers = (await message.guild.members.fetch()).filter(
            (member) => !member.user.bot
        );

        guildMembers.forEach((member) => {
            const committeeRoles = member.roles.cache.filter((role) =>
                role.name.toLowerCase().includes('committee')
            );
            committeeRoles.forEach((role) => member.roles.remove(role.id));
        });

        const logChannel = await getLogChannel(message.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(null, 'Committees Cleared')
                .setColor('#00d166')
                .setDescription(
                    'Successfully removed all committee roles from server users!'
                );

            webhookClient.send({ embeds: [embed] });
        }
    },
};
