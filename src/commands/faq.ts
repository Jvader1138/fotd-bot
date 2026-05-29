import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command';

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Frequently Asked Questions'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.reply('No info yet...');
  },
};

export default pingCommand;
