import { Logger } from '@nestjs/common';
import { Client } from 'discord.js';

export function onClientReady(client: Client<true>) {
  Logger.log(`Ready! Logged in as ${client.user.tag}`);
}
