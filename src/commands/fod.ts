import axios from 'axios';
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { Location } from '../types/Location';

const fodCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('fod')
    .setDescription('Flavors of the Day')
    .addIntegerOption((option) => option
      .setName('zip')
      .setDescription('Zip code to search')
      .setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    try {
      const zip = interaction.options.getInteger('zip', true);
      const [ lat, long ] = await getLatLong(zip);
      const nearbyCulvers = await getNearbyCulvers(lat, long);
      const locations = nearbyCulvers?.data?.geofences as Location[];
      const embed = getEmbed(locations);
      await interaction.reply({ embeds: [ embed ]})
    } catch (error: any) {
      await interaction.reply({
        content: `Error: ${error.message}`,
        flags: MessageFlags.Ephemeral
      });
    }
  },
};

async function getLatLong(zip: number): Promise<[number, number]> {
  const geoLoc = await fetchHTML('https://geocoding-api.open-meteo.com/v1/search?name=' + zip + '&count=1&language=en&format=json&countryCode=US');
  if (!geoLoc.results || geoLoc.results.length === 0) {
    throw Error('No geocoding results found');
  }
  const lat = geoLoc.results[0].latitude;
  const long = geoLoc.results[0].longitude;
  return [ lat, long ];
}

async function getNearbyCulvers(lat: number, long: number) {
  const nearbyCulvers = await fetchHTML('https://www.culvers.com/api/locator/getLocations?lat=' + lat + '&long=' + long + '&radius=16093&limit=100&layer=');
  if (nearbyCulvers.isSuccessful === false || nearbyCulvers.data?.geofences?.length === 0) {
    throw Error('No Culver\'s locations found');
  }
  return nearbyCulvers;
}

function getEmbed(locations: Location[]) {
  const fields = locations.slice(0, 25).map((loc) => ({
    name: loc.metadata.slug,
    value: loc.metadata.flavorOfDayName,
    inline: true
  }));

  return new EmbedBuilder()
    .setColor(0x55195)
    .setTitle('Flavors of the Day')
    .addFields(fields);
}

async function fetchHTML(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    return null;
  }
}

export default fodCommand;
