import { BotEvent } from '../types/Event';
import { deployCommands } from '../deploy-commands';

const guildCreateEvent: BotEvent<'guildCreate'> = {
  name: 'guildCreate',
  execute: async (guild) => {
    await deployCommands({ guildId: guild.id });
  }
};

export default guildCreateEvent;
