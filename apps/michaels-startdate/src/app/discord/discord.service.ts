import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditLogEvent, Client, Events, GatewayIntentBits } from 'discord.js';
import { CommandService } from '../command/command.service';
import { onClientReady } from './events/client-ready.event';
import { onInteractionCreate } from './events/interaction-create.event';
import constant from '../constant';
import { onAuditLogCreate } from './events/audit-log-create.event';

@Injectable()
export class DiscordService {
  private readonly client: Client<boolean>;

  constructor(configService: ConfigService, commandService: CommandService) {
    const token = configService.getOrThrow(constant.config.discordToken);
    const clientId = configService.getOrThrow(constant.config.clientId);
    const isDevMode = !!configService.get(constant.config.devMode);

    commandService.loadAllCommands().then((commands) => {
      if (isDevMode) {
        const guildId = configService.getOrThrow(constant.config.guildId);
        commandService.addGuildCommands(clientId, guildId, commands);
      } else {
        commandService.addGlobalCommands(clientId, commands);
      }

      this.client.once(Events.ClientReady, onClientReady);
      this.client.on(Events.InteractionCreate, async (interaction) =>
        onInteractionCreate(interaction, commands)
      );

      this.client.on(Events.GuildAuditLogEntryCreate, async (auditLog) => onAuditLogCreate(auditLog, this.client));
    });

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration,
      ],
    });

    this.client.login(token);
  }
}
