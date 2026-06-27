import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  cooldown?: number; // Cooldown duration in seconds
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
