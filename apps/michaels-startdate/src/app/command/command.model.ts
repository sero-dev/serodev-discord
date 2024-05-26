import { SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (value: any) => Promise<void>;
}

export function isCommand(o: any): o is Command {
  return 'data' in o && 'execute' in o;
}
