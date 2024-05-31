import { Logger } from '@nestjs/common';
import { Client } from 'discord.js';

const logger = new Logger(onClientReady.name);
export async function onClientReady(client: Client<true>) {
  logger.log(`Ready! Logged in as ${client.user.tag}`);
}
