import { Command } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { Message } from 'discord.js';
import { guildId } from '../../Config';

export default class Name extends Command {
    public constructor() {
        super('name', {
            aliases: ['name'],
            category: 'Basic',
            description: {
                content: 'Sets display name of user',
                usage: 'name [ FirstName ] [ LastName ]',
                examples: ['name John Doe'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'firstName',
                    type: 'string',
                },
                {
                    id: 'lastName',
                    type: 'string',
                },
            ],
        });
    }

    public async exec(message: Message, { firstName, lastName }: { firstName: string; lastName: string }): Promise<Message> {
        const guildMember: GuildMember = await (message.channel.type !== 'text'
            ? message.client.guilds.cache.get(guildId).members.fetch(message.author.id)
            : message.member);

        await guildMember.setNickname(`${firstName} ${lastName}`);

        return message.util.send({
            embed: {
                title: 'Request Received!',
                color: 0xffa500,
                description:
                    `Your nickname was successfully set to \`${firstName} ${lastName}\`!\n\n` +
                    `Please wait for the High Alpha, Beta, or Theta to assign you the proper role to gain access to the server.\n\n` +
                    `*If you need any help please send a message in the \`un-verified\` channel*`,
            },
        });
    }
}
