import { CacheType, Interaction } from 'discord.js';
import { CommandDirectory } from '../../command/command.model';
import { Logger } from '@nestjs/common';

const logger = new Logger(onInteractionCreate.name);
export async function onInteractionCreate(
  interaction: Interaction<CacheType>,
  commands: CommandDirectory
) {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}
