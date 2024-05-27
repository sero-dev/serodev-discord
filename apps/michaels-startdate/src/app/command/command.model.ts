import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}

export interface CommandInstalledResponse {
  id: string;
  application_id: string;
  name: string;
  description: string;
}

export function isCommand(o: object): o is Command {
  return 'data' in o && 'execute' in o;
}

export class CommandDirectory extends Collection<string, Command> {
  addCommand(command: Command) {
    super.set(command.data.name, command);
  }
}
