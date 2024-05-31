import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../command.model';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ViolationCommand implements Command {
  private logger = new Logger(ViolationCommand.name);
  private violations: Violation[] = [];

  data = new SlashCommandBuilder()
    .setName('violations')
    .setDescription(
      'Replies with the list of discord users with the most violations'
    );

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const topViolations = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Top Server Violators')
      .setAuthor({ name: 'Robo Michael' });

    const topViolators = await Promise.all(
      this.violations
        .sort((a, b) => this.getViolationScore(b) - this.getViolationScore(a))
        .slice(0, Math.min(this.violations.length, 3))
        .map((v) => this.violationString(v, interaction.client))
    );

    const description = `
      These individuals have commited heinous acts against this discord server. \n\n${topViolators.join(
        '\n'
      )}
    `;

    topViolations.setDescription(description);

    this.violations
      .sort((a, b) => this.getViolationScore(b) - this.getViolationScore(a))
      .slice(0);

    this.logger.log(
      `${interaction.user.globalName} has requested the /${this.data.name}`
    );
    await interaction.reply(description);
  }

  addViolation(userId: string, guildId: string, type: ViolationType) {
    const record = this.violations.find(
      (v) => v.userId === userId && v.guildId === guildId
    );

    if (record) {
      switch (type) {
        case 'deafen':
          record.timesDeafen++;
          break;
        case 'muted':
          record.timesMuted++;
          break;
        case 'disconnected':
          record.timesDisconnected++;
          break;
        case 'kicked':
          record.timesKicked++;
          break;
      }
    } else {
      const newRecord: Violation = {
        userId,
        guildId,
        timesDeafen: type === 'deafen' ? 1 : 0,
        timesMuted: type === 'muted' ? 1 : 0,
        timesDisconnected: type === 'disconnected' ? 1 : 0,
        timesKicked: type === 'kicked' ? 1 : 0,
      };
      this.violations.push(newRecord);
    }
  }

  private getViolationScore(violation: Violation) {
    return (
      violation.timesDeafen * 40 +
      violation.timesMuted * 50 +
      violation.timesDisconnected * 100 +
      violation.timesKicked * 300
    );
  }

  private async violationString(violation: Violation, client: Client<boolean>) {
    const user = await client.users.fetch(violation.userId);
    return `**${
      user.globalName
    }** has generated a violation score of **${this.getViolationScore(
      violation
    )}**\`\`\`- Number of users deafened: ${
      violation.timesDeafen
    }\n- Number of users muted: ${
      violation.timesMuted
    }\n- Number of users disconnected: ${
      violation.timesDisconnected
    }\n- Number of users kicked: ${violation.timesKicked}\`\`\`
    `.trim();
  }
}

interface Violation {
  guildId: string;
  userId: string;
  timesDeafen: number;
  timesMuted: number;
  timesDisconnected: number;
  timesKicked: number;
}

type ViolationType = 'deafen' | 'muted' | 'disconnected' | 'kicked';
