import { Client, GatewayIntentBits  } from 'discord.js';
import { config } from './config';
import { loadEvents } from './load-events';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
});

loadEvents(client);

client.login(config.DISCORD_TOKEN);
