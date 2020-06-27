const { getRoles } = require('../../modules/utils.js');
const initiate = require('./initiate.js');
const { WebhookClient } = require('discord.js');
const { logEmbed } = require('../../modules/embeds.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = {
    name: 'initiateAll',
    description: 'Promotes all the associates to Actives',
    args: false,
    adminOnly: true,
    guildOnly: true,
    category: 'moderation',
    async execute(message) {
        const roles = await getRoles(message.client);

        if (!roles.associate) {
            return await message.reply('Please set the Associate role!');
        }

        const associateRole = await message.guild.roles.fetch(
            roles.associate.Id
        );
        associateRole.members.forEach(
            async (member) => await initiate.execute(message, [member.user.id])
        );

        const logChannel = await getLogChannel(message.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(null, 'Initiate All')
                .setColor('#00d166')
                .setDescription('All associates successfully initiated!');

            webhookClient.send({ embeds: [embed] });
        }
    },
};
