import { ClientEvents } from 'discord.js';

export interface BotEvent<T extends keyof ClientEvents> {
  name: T;
  once?: boolean; // Optional: whether the event should only fire once
  execute: (...args: ClientEvents[T]) => Promise<void> | void;
}
