const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'roleManagement',
    description: `Sends an embed for the reaction roles for the roleManagement`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message) {
        const embedMessage = await message.channel.send({
            embed: new MessageEmbed({
                color: 0x1e90ff,
                title: 'Role Management',
                description:
                    'Reacting with the corresponding emojis will run that command.\n\n' +
                    '1) Clear all Committee Roles\n' +
                    '2) Initiate all Associates (Give them the active role)\n' +
                    '3) Clear all Big Brother and BBC roles',
            }),
        });

        const emojis = new Map();
        emojis.set('1️⃣', 'clearCommittees');
        emojis.set('2️⃣', 'initiateAll');
        emojis.set('3️⃣', 'clearBigs');

        emojis.forEach(async (value, emoji) => await embedMessage.react(emoji));

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: embedMessage.id,
            commands: {},
        });

        reactionMessage.commands = emojis;

        return reactionMessage.save();
    },
};
