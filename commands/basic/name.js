const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'name',
    description: 'Sets the users nickname',
    args: true,
    usage: '<First Name> <Last Name>',
    category: 'basic',
    async execute(message, args) {
        if (args.length != 2) {
            await message.reply('You must pass a first and last name to this command');
            return;
        }
        const firstName = args[0];
        const lastName = args[1];

        const guildMember = await (message.channel.type !== 'text'
            ? message.client.guilds.cache.get(message.client.guildId).members.fetch(message.author.id)
            : message.member);

        await guildMember.setNickname(`${firstName} ${lastName}`);
        await message.channel.send({
            embed: {
                title: 'Request Received!',
                color: 0xffa500,
                description:
                    `Your nickname was successfully set to \`${firstName} ${lastName}\`!\n\n` +
                    `Please wait for the High Alpha, Beta, or Theta to assign you the proper role to gain access to the server.\n\n` +
                    `*If you need any help please send a message in the \`un-verified\` channel*`,
            },
        });

        const roles = await getRoles(message.client);

        if (guildMember.roles.cache.has(roles.unverified.Id) && !guildMember.roles.cache.has(roles.verified.Id)) {
            message.client.setMaxListeners(15).emit('userVerifiedName', guildMember);
        }
    },
};
