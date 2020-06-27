const { WebhookClient } = require('discord.js');
const { logEmbed } = require('../../modules/embeds.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = async (client, member, reason) => {
    const logChannel = await getLogChannel(client);
    if (logChannel) {
        const webhookClient = new WebhookClient(
            logChannel.Id,
            logChannel.token
        );
        const embed = logEmbed(member, 'User Kicked')
            .setColor('#ff0000')
            .addField('User', `<@!${member.user.id}>`, true)
            .addField('Reason', reason, true);

        webhookClient.send({ embeds: [embed] });
    }
};
