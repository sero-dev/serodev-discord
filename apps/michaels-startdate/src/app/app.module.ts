import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandService } from './command/command.service';
import { DiscordService } from './discord/discord.service';
import { ConfigModule } from '@nestjs/config';
import { PingCommand } from './command/commands/ping.command';
import { StartDateCommand } from './command/commands/startdate.command';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    CommandService,
    DiscordService,
    PingCommand,
    StartDateCommand,
  ],
})
export class AppModule {}
