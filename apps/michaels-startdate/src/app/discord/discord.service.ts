import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CommandService } from '../command/command.service';
import { onClientReady } from './events/client-ready.event';

@Injectable()
export class DiscordService {
  private readonly client: Client<boolean>;

  constructor(configService: ConfigService, commandService: CommandService) {
    const token = configService.getOrThrow('DISCORD_TOKEN');
    const clientId = configService.getOrThrow('DISCORD_CLIENT_ID');
    const isDevMode = !!configService.get('DEV_MODE');
    commandService.loadAllCommands().then((commands) => {
      if (isDevMode) {
        const guildId = configService.getOrThrow('DISCORD_GUILD_ID');
        commandService.addGuildCommands(clientId, guildId, commands);
      } else {
        commandService.addGlobalCommands(clientId, commands);
      }
      this.client.once(Events.ClientReady, onClientReady);
      // this.client.on(Events.InteractionCreate, async () => onInteractionCreate);
    });
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.login(token);
  }
}
