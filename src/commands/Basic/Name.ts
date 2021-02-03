import { Command } from 'discord-akairo';
import { Message, GuildMember, MessageEmbed, ImageSize } from 'discord.js';

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
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: (msg: Message) => msg.member,
                },
                {
                    id: 'size',
                    type: (_: Message, str: string): null | Number => {
                        if (str && !isNaN(Number(str)) && [16, 32, 64, 128, 256, 512, 1024, 2048].includes(Number(str))) return Number(str);
                        return null;
                    },
                    match: 'option',
                    flag: ['-size='], // !avatar @Host#001 -size=512,
                    default: 2048,
                },
            ],
        });
    }

    public exec(message: Message, { member, size }: { member: GuildMember; size: number }): Promise<Message> {
        return message.util.send(
            new MessageEmbed()
                .setTitle(`Avatar | ${member.user.tag}`)
                .setColor('RANDOM')
                .setImage(member.user.displayAvatarURL({ size: size as ImageSize, dynamic: true }))
        );
    }
}
