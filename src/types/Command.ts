import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  cooldown?: number; // Cooldown duration in seconds
  execute: (interaction: CommandInteraction) => Promise<void>;
}
