import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../command.model';
import { Injectable } from '@nestjs/common';

/**
 * A command that replies Pong.
 * This command is implemented as a slash command for Discord.
 */
@Injectable()
export class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply('Pong!');
  }
}
