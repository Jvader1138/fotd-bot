import { Client } from 'discord.js';
import { events } from './events';
import { BotEvent } from './types/Event';

const eventsList = Object.values(events).map((event) => event);

export async function loadEvents(client: Client) {
  for (const eventModule of eventsList) {
    const event = eventModule as BotEvent<any>;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
