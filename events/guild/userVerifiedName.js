const { logEmbed } = require('../../modules/embeds.js');
const setActive = require('../../commands/moderation/setActive.js');
const setAlumni = require('../../commands/moderation/setAlumni.js');
const setAssociate = require('../../commands/moderation/setAssociate.js');
const setPNM = require('../../commands/moderation/setPNM.js');
const { getLogChannel } = require('../../modules/utils.js');
const { getRoles } = require('../../modules/utils.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {
    try {
        const roles = await getRoles(client);
        await member.roles.set([roles.verified.Id]);

        const logChannel = await getLogChannel(member.client);
        if (logChannel) {
            const channel = member.guild.channels.cache.get(
                logChannel.channelId
            );
            const embed = logEmbed(member, 'Name Verified')
                .setColor('#ffa500')
                .addField('Claimed Name', member.displayName, true)
                .addField('User', `<@!${member.id}>`, true)
                .setDescription(
                    `Please react with the corresponding number to assign the user's role:\n\n` +
                        `1) PNM\n` +
                        `2) Associate\n` +
                        `3) Active\n` +
                        `4) Alumni\n\n` +
                        `:x: Kick\n`
                );

            const embedMessage = await channel.send({ embed: embed });

            await handleReactions(client, member, embedMessage);
        }
    } catch (ex) {
        console.error(ex);
        await member.send('An error occurred... ' + ex.message);
    }
};

const handleReactions = async (client, member, embedMessage) => {
    const options = {
        '1️⃣': setPNM,
        '2️⃣': setAssociate,
        '3️⃣': setActive,
        '4️⃣': setAlumni,
        '❌': kick,
    };
    const emojis = Object.keys(options);

    emojis.forEach(async (emoji) => await embedMessage.react(emoji));

    const filter = (reaction, user) =>
        emojis.includes(reaction.emoji.name) && !user.bot;

    const reactions = await embedMessage.awaitReactions(filter, {
        max: 1,
    });

    const admin = reactions
        .first()
        .users.cache.filter((u) => !u.bot)
        .first();

    const emojiName = reactions.first()._emoji.name;
    switch (emojiName) {
        case '❌':
            await options[emojiName](client, member, admin);
            break;
        default:
            options[emojiName].execute(embedMessage, [member.id], admin.id);
    }
};

const kick = async (client, member, admin) => {
    await member.send({
        embed: new MessageEmbed({
            color: 0xff0000,
            title: `Entry Denied`,
            description:
                `You have been denied entry to this server.\n\n` +
                `*If you believe this was a mistake please reach out to the person who invited you*`,
        }),
    });

    client
        .setMaxListeners(15)
        .emit(
            'userKicked',
            member,
            `User denied entry to server by <@!${admin.id}>`
        );

    await member.kick(
        `Denied entry by ${admin.username}#${admin.discriminator}`
    );
};
