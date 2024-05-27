import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from 'discord.js';
import { Command } from '../command.model';

/**
 * A command that replies with Michael's start date.
 * This command is implemented as a slash command for Discord.
 */
export class StartDateCommand implements Command {
  data = new SlashCommandBuilder()
    .setName('startdate')
    .setDescription("Replies with Michael's Start Date (if you're lucky)");

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply('Time');
  }
}
