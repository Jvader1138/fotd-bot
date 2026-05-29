import { Client } from 'discord.js';
import { BotEvent } from '../types/Event';
import { deployCommandsToAllGuilds } from '../deploy-commands';

const clientReadyEvent: BotEvent<'clientReady'> = {
  name: 'clientReady',
  once: true,
  execute: async (client: Client) => {
    await deployCommandsToAllGuilds(client);
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  }
};

export default clientReadyEvent;
