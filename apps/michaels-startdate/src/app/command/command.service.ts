import { Injectable, Logger } from '@nestjs/common';
import { Collection, REST, Routes } from 'discord.js';
import path from 'path';
import * as fs from 'fs';
import { Command, isCommand } from './command.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommandService {
  private _commands = new Collection<string, Command>();

  public get commands(): Collection<string, Command> {
    return this._commands;
  }

  constructor(private configService: ConfigService) {}

  public async loadAllCommands(): Promise<Collection<string, Command>> {
    Logger.log(__dirname);

    // const foldersPath = path.join(__dirname, 'commands');
    // const commandFiles = fs
    //   .readdirSync(foldersPath)
    //   .filter((file) => file.endsWith('.command.ts'));

    // for (const file of commandFiles) {
    //   const filePath = path.join(foldersPath, file);
    //   const command = await import(filePath);
    //   if (isCommand(command)) {
    //     this._commands.set(command.data.name, command);
    //   } else {
    //     console.log(
    //       `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    //     );
    //   }
    // }

    return this.commands;
  }

  public async addGlobalCommands(
    clientId: string,
    commands: Collection<string, Command>
  ) {
    const route = Routes.applicationCommands(clientId);
    await this.requestCommandInstall(route, commands);
  }

  public async addGuildCommands(
    clientId: string,
    guildId: string,
    commands: Collection<string, Command>
  ) {
    const route = Routes.applicationGuildCommands(clientId, guildId);
    await this.requestCommandInstall(route, commands);
  }

  private async requestCommandInstall(
    route: `/${string}`,
    commands: Collection<string, Command>
  ) {
    const token = this.configService.getOrThrow('DISCORD_TOKEN');
    Logger.log(commands);

    // if (commands.keys.length === 0) {
    //   console.log('No commands were given to install');
    // }

    // const commandsRequest = commands.map((c) => c.data.toJSON());
    // const rest = new REST().setToken(token);

    // try {
    //   console.log(
    //     `Started refreshing ${commandsRequest.length} application (/) commands.`
    //   );

    //   const data = (await rest.put(route, { body: commandsRequest })) as any[];
    //   console.log(JSON.stringify(data));
    //   console.log(
    //     `Successfully reloaded ${data.length} application (/) commands.`
    //   );
    // } catch (error) {
    //   console.error(error);
    // }
  }
}
