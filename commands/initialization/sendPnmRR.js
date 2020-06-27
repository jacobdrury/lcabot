const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'sendPnmRR',
    description: `Sends an embed for the reaction roles for the pnm chats role`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message) {
        const embedMessage = await message.channel.send({
            embed: new MessageEmbed({
                color: 0x1e90ff,
                title: 'PNM Chats',
                description:
                    'Reacting to this post with :white_check_mark: will add you to the PNM chats.\n\n' +
                    'Removing your reaction will remove you from the PNM chats',
            }),
        });

        const emoji = '✅';
        await embedMessage.react(emoji);

        const roles = await getRoles(message.client);

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: embedMessage.id,
            reactions: {},
        });

        reactionMessage.reactions.set(emoji, roles.pnmChats.Id);

        return reactionMessage.save();
    },
};
