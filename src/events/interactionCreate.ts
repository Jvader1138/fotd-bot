import { Collection, Interaction, MessageFlags } from 'discord.js';
import { BotEvent } from '../types/Event';
import { commands } from '../commands';

// Define a type for your cooldown data: Map of <UserId, Timestamp>
type CooldownsMap = Collection<string, Collection<string, number>>;

// Initialize the cooldowns collection in your client or globally
const cooldowns: CooldownsMap = new Collection();

const interactionCreateEvent: BotEvent<'interactionCreate'> = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      const command = commands[commandName as keyof typeof commands];

      // Cooldown Logic Start
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name)!;
      const defaultCooldown = 3; // Default cooldown if none specified
      const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1_000; // Convert to milliseconds

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          await interaction.reply({
            content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      // Cooldown Logic End

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral
          });
        }
      }
    }
  }
};

export default interactionCreateEvent;
