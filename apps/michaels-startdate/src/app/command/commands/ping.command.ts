import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.model';

export class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

  async execute(interaction) {
    await interaction.reply('Pong!');
  }
}
