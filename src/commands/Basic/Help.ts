import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { prefix } from '../../Config';

export default class Help extends Command {
    public constructor() {
        super('help', {
            aliases: ['help'],
            description: {
                content: 'Desplays a list of available command, or detailed info for a specific command.',
                usage: '[command]',
            },
            category: 'Basic',
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                },
            ],
        });
    }

    public async exec(message: Message, { command }: { command: Command }): Promise<Message | Message[]> {
        if (!command) return await this.getAllCommands(message);

        return await this.getSpecificCommand(message, command);
    }

    private async getAllCommands(message: Message): Promise<Message | Message[]> {
        const embed = new MessageEmbed().setColor(0x1e90ff).addField(
            'Commands',
            `A list of available commands.
                For additional info on a command, type \`${prefix}help <command>\`
            `
        );

        for (const category of this.handler.categories.values()) {
            embed.addField(
                `❯ ${category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase())}`,
                `${category
                    .filter((cmd): boolean => cmd.aliases.length > 0)
                    .map((cmd): string => `\`${cmd.aliases[0]}\``)
                    .join(' ')}`
            );
        }

        return message.util!.send(embed);
    }

    private async getSpecificCommand(message: Message, command: Command): Promise<Message | Message[]> {
        const embed = new MessageEmbed()
            .setColor(0x1e90ff)
            .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
            .addField(
                '❯ Description',
                `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Owner Only]**' : ''}`
            );

        if (command.aliases.length > 1) embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length)
            embed.addField('❯ Examples', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);

        return message.util!.send(embed);
    }
}
