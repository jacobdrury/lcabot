const { MessageEmbed } = require('discord.js');

exports.logEmbed = (member, action) => {
    return new MessageEmbed({
        color: 0x1e90ff,
        author: {
            name: member
                ? `[${action}] ${member.user.username}#${member.user.discriminator}`
                : action,
            icon_url: member
                ? `${member.user.displayAvatarURL({ dynamic: true })}`
                : ``,
        },
    });
};

exports.newUserEmbed = (member) => {
    return new MessageEmbed({
        color: 0x800080,
        title: `Welcome to the ${member.guild.name} server!`,
        thumbnail: {
            url: member.guild.iconURL(),
        },
        description:
            `Please respond to this message with ${member.client.prefix}name firstName lastName so I can set your nickname in the server!\n\n` +
            `Example: ${member.client.prefix}name John Doe\n\n` +
            `*If you need any help please send a message in the \`un-verified\` channel*`,
    });
};

exports.setToRoleEmbedForUser = async (member, roleId) => {
    const role = await member.guild.roles.fetch(roleId);
    return new MessageEmbed({
        color: 0x00d166,
        title: `Role Added!`,
        description: `You have been added to the \`${role.name}\` role!`,
    });
};

exports.removeRoleEmbedForUser = async (member, roleId) => {
    const role = await member.guild.roles.fetch(roleId);
    return new MessageEmbed({
        color: 0x00d166,
        title: `Role Removed!`,
        description: `You have been removed from the \`${role.name}\` role!`,
    });
};
