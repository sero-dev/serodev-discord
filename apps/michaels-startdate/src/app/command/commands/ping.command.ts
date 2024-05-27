import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../command.model';

/**
 * A command that replies Pong.
 * This command is implemented as a slash command for Discord.
 */
export class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply('Pong!');
  }
}
