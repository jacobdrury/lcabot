const { setToRole } = require('../../modules/UserHelpers.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'setAssociate',
    description: 'Assigns the Associate role to the user',
    args: true,
    usage: '<user (either by tagging them or passing user id)>',
    adminOnly: true,
    guildOnly: true,
    category: 'moderation',
    async execute(message, args, admin = null) {
        const rawId = args[0];
        const userId = rawId.replace('<@!', '').replace('>', '');
        if (isNaN(userId)) return message.reply('Please tag the user or provide their user id');

        const member = await message.guild.members.fetch(userId);
        const roles = await getRoles(message.client);

        if (!roles.associate) {
            return await message.reply('Please set the associate role!');
        }

        setToRole(member, roles.associate.Id, admin || message.author.id);
    },
};
