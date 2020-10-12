module.exports = {
    name: 'pfp',
    adminOnly: true,
    category: 'moderation',
    async execute(message) {
        await message.channel.send(
            message.guild.me.user.avatarURL({ dynamic: true })
        );
    },
};
