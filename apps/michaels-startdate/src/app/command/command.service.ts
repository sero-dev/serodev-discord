import { Injectable, Logger } from '@nestjs/common';
import { REST, Routes } from 'discord.js';
import { CommandDirectory, CommandInstalledResponse } from './command.model';
import { ConfigService } from '@nestjs/config';
import { PingCommand } from './commands/ping.command';
import { StartDateCommand } from './commands/startdate.command';
import constant from '../../constant';

/**
 * Service for managing and installing Discord commands.
 * This service loads commands, and installs them either globally or for specific guilds.
 */
@Injectable()
export class CommandService {
  private _commands = new CommandDirectory();
  private readonly logger = new Logger(CommandService.name);

  /**
   * Gets the command directory containing all commands.
   * @returns {CommandDirectory} The directory of commands.
   */
  public get commands(): CommandDirectory {
    return this._commands;
  }

  constructor(private readonly configService: ConfigService) {}

  /**
   * Loads all available commands into the command directory.
   * @returns {Promise<CommandDirectory>} A promise that resolves with the loaded command directory.
   */
  public async loadAllCommands(): Promise<CommandDirectory> {
    this._commands.addCommand(new PingCommand());
    this._commands.addCommand(new StartDateCommand());
    return this.commands;
  }

  /**
   * Adds global commands to the Discord application.
   * @param {string} clientId - The ID of the Discord client (application).
   * @param {CommandDirectory} commands - The directory of commands to install.
   */
  public async addGlobalCommands(clientId: string, commands: CommandDirectory) {
    const route = Routes.applicationCommands(clientId);
    await this.requestCommandInstall(route, commands);
  }

  /**
   * Adds guild-specific commands to the Discord application.
   * @param {string} clientId - The ID of the Discord client (application).
   * @param {string} guildId - The ID of the guild where commands will be installed.
   * @param {CommandDirectory} commands - The directory of commands to install.
   */
  public async addGuildCommands(
    clientId: string,
    guildId: string,
    commands: CommandDirectory
  ) {
    const route = Routes.applicationGuildCommands(clientId, guildId);
    await this.requestCommandInstall(route, commands);
  }

  /**
   * Installs commands by making a request to the Discord API.
   * @private
   * @param {`/${string}`} route - The API route for installing commands.
   * @param {CommandDirectory} commands - The directory of commands to install.
   */
  private async requestCommandInstall(
    route: `/${string}`,
    commands: CommandDirectory
  ) {
    const token = this.configService.getOrThrow(constant.config.discordToken);

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
