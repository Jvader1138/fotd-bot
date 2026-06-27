import { Client, REST, Routes } from 'discord.js';
import { config } from './config';
import { commands } from './commands';

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommandsToAllGuilds(client: Client) {
  if (config.NODE_ENV === 'prod') {
    try {
      console.log('Deploying commands to globally');

      await rest.put(
        Routes.applicationCommands(config.DISCORD_CLIENT_ID),
        {
          body: commandsData,
        }
      );

      console.log('Updated commands to globally');
    } catch (error) {
      console.error('Failed deploying commands to globally', error);
    }
  } else {
    for (const [, guild] of client.guilds.cache) {
      try {
        console.log(`Deploying commands to ${guild.name}`);

        await rest.put(
          Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild.id),
          {
            body: commandsData,
          }
        );

        console.log(`Updated commands for ${guild.name}`);
      } catch (error) {
        console.error(`Failed deploying to guild ${guild.id}`, error);
      }
    }
  }
}

export async function deployCommands({ guildId }: DeployCommandsProps) {
  if (config.NODE_ENV === 'prod') return;

  try {
    console.log('Started refreshing application commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log('Successfully reloaded application commands.');
  } catch (error) {
    console.error(`Failed deploying to guild ${guildId}`, error);
  }
}
