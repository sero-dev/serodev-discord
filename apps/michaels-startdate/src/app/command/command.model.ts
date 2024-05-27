/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (value: any) => Promise<void>;
}

export interface CommandInstalledResponse {
  id: string;
  application_id: string;
  name: string;
  description: string;
}

export function isCommand(o: any): o is Command {
  return 'data' in o && 'execute' in o;
}

export class CommandDirectory extends Collection<string, Command> {
  addCommand(command: Command) {
    super.set(command.data.name, command);
  }
}
