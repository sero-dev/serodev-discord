import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from 'discord.js';
import { Command } from '../command.model';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import constant from '../../../constant';

/**
 * A command that replies with Michael's start date.
 * This command is implemented as a slash command for Discord.
 */
@Injectable()
export class StartDateCommand implements Command {
  private logger = new Logger(StartDateCommand.name);
  constructor(private configService: ConfigService) {}

  data = new SlashCommandBuilder()
    .setName('startdate')
    .setDescription("Replies with Michael's Start Date (if you're lucky)");

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const { messages } = constant;
    const users = this.loadUserId;
    const timeUntil = '10 seconds';

    this.logger.log(JSON.stringify(users));

    switch (interaction.user.id) {
      case users['mango']?.id:
        break;
      default:
        await interaction.reply(messages.default(timeUntil));
    }
  }

  private loadUserId(): { [Key: string]: User } {
    const { userIds } = constant.config;
    const userIdKeys = Object.keys(userIds);
    const users: { [Key: string]: User } = {};

    this.logger.log(JSON.stringify(constant));

    userIdKeys.forEach((key) => {
      const id = this.configService.getOrThrow(userIds[key]);
      users[key] = { id, callCount: 0 };
    });

    return users;
  }
}

interface User {
  id: string;
  callCount: number;
}
