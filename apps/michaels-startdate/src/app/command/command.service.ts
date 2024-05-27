import { Injectable, Logger } from '@nestjs/common';
import { REST, Routes } from 'discord.js';
import { CommandDirectory, CommandInstalledResponse } from './command.model';
import { ConfigService } from '@nestjs/config';
import { PingCommand } from './commands/ping.command';

@Injectable()
export class CommandService {
  private _commands = new CommandDirectory();
  private readonly logger = new Logger(CommandService.name);

  public get commands(): CommandDirectory {
    return this._commands;
  }

  constructor(private readonly configService: ConfigService) {}

  public async loadAllCommands(): Promise<CommandDirectory> {
    this._commands.addCommand(new PingCommand());
    return this.commands;
  }

  public async addGlobalCommands(clientId: string, commands: CommandDirectory) {
    const route = Routes.applicationCommands(clientId);
    await this.requestCommandInstall(route, commands);
  }

  public async addGuildCommands(
    clientId: string,
    guildId: string,
    commands: CommandDirectory
  ) {
    const route = Routes.applicationGuildCommands(clientId, guildId);
    await this.requestCommandInstall(route, commands);
  }

  private async requestCommandInstall(
    route: `/${string}`,
    commands: CommandDirectory
  ) {
    const token = this.configService.getOrThrow('DISCORD_TOKEN');

    const commandsRequest = commands.map((c) => c.data.toJSON());
    const rest = new REST().setToken(token);

    try {
      this.logger.log(
        `Started refreshing ${commandsRequest.length} application (/) commands.`
      );

      const data = (await rest.put(route, {
        body: commandsRequest,
      })) as CommandInstalledResponse[];
      this.logger.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
