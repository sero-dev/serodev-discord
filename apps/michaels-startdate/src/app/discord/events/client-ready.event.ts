import { Logger } from '@nestjs/common';
import { Client } from 'discord.js';

export function onClientReady(client: Client<true>) {
  const logger = new Logger(onClientReady.name);
  logger.log(`Ready! Logged in as ${client.user.tag}`);
}
