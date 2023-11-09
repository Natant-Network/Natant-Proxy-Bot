import { Events, BaseInteraction } from "discord.js";
import type { SlashCommand, DiscordClient } from "../lib/types.js";
import { getProxy, ProxyError } from "../lib/proxy.js";
import { ClientMessages } from "../lib/messages.js";

// If you change this, make sure to also change it in commands/panel.ts
const proxyButtonPrefix = "$LM_TYPE$:";

export default function registerHandler(client: DiscordClient) {
  const { logger } = client;
  client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (interaction.isChatInputCommand()) {
      // @ts-ignore We check for null values later
      const cmd: SlashCommand = client.commands.get(interaction.commandName);
      if (!(cmd && cmd.run)) return;
      try {
        cmd.run(client, interaction);
      } catch (err) {
        console.log(`There was a error while runnning command ${interaction.commandName}:`);
        console.log(err);
      }
    };

    if (interaction.isAutocomplete()) {
      // @ts-ignore Same with all of these
      const cmd: SlashCommand = client.commands.get(interaction.commandName);
      if (!(cmd && cmd.autocomplete)) return;
      try {
        cmd.autocomplete(client, interaction);
      } catch (err) {
        console.log(err);
      }
    };

    if (interaction.isContextMenuCommand()) {
      // @ts-ignore
      const cmd: SlashCommand = client.commands.get(interaction.commandName);
      if (!(cmd && cmd.run)) return;
      try {
        cmd.run(client, interaction);
      } catch (err) {
        console.log(`There was a error while runnning context command ${interaction.commandName}:`);
        console.log(err);
      }
    };

    if (interaction.isModalSubmit()) {
      // @ts-ignore
      const cmd: SlashCommand = client.commands.get(interaction.customId);
      if (!(cmd && cmd.modal)) return;
      try {
        cmd.modal(client, interaction);
      } catch (err) {
        console.log(err);
      }
    };

    if (interaction.isButton()) {
      handleButton(client, interaction);
    }
  });
}

async function handleButton(client: DiscordClient, interaction: any) {
  if (interaction.customId.startsWith(proxyButtonPrefix)) {
    const category = interaction.customId.slice(proxyButtonPrefix.length, interaction.customId.length);
    await interaction.deferReply({ ephemeral: true });
    var data;
    try {
      data = await getProxy(interaction, category);
    } catch (error) {
      if (error instanceof ProxyError) return interaction.editReply({ content: error.message }); else return;
    }
    if (data.dm) {
      try {
        await interaction.user.send(data.data);
        return interaction.editReply({ content: ClientMessages.MSG_CHECK_DMS });
      } catch {
        data.data.content = ClientMessages.ERR_FAILED_DM;
      }
    }
    interaction.editReply(data.data);
  }
}