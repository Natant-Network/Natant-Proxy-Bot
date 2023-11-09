import {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  SlashCommandBuilder
} from "discord.js";
import { guildModel } from "../lib/schema.ts";
import { getProxy, ProxyError } from "../lib/proxy.ts";
import { ClientMessages } from "../lib/messages.ts";

export const data = new SlashCommandBuilder()
  .setName("proxy")
  .setDescription("Get a random proxy link from a selected category")
  .setDMPermission(false)
  .addStringOption(option =>
    option
      .setName("category")
      .setDescription("The category to get a proxy link from")
      .setAutocomplete(true)
      .setRequired(true)
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const category = interaction.options.getString("category", true);
  await interaction.deferReply({ ephemeral: true }); // defer reply
  var data;
  try {
    data = await getProxy(interaction, category);
  } catch(error) {
    if(error instanceof ProxyError) return interaction.editReply({ content: error.message }); else return;
  }
  if(data.dm) {
    try {
      await interaction.user.send(data.data);
      return interaction.editReply({ content: ClientMessages.MSG_CHECK_DMS });
    } catch {
      data.data.content = ClientMessages.ERR_FAILED_DM;
    }
  }
  interaction.editReply(data.data);
}

export async function autocomplete(client: any, interaction: AutocompleteInteraction) {
  const doc = await guildModel.findOne({ GuildId: interaction.guild?.id });
  if(!doc) return interaction.respond([]);
  const input: string = interaction.options.getFocused();
  const data: string[] = doc.types.filter(type => type.startsWith(input));
  interaction.respond(
    data.map(type => ({ name: type, value: type })),
  );
}