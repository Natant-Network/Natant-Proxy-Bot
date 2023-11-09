import { ChatInputCommandInteraction, SlashCommandBuilder, ContextMenuCommandBuilder, EmbedBuilder } from "discord.js";
import type { SlashCommand } from "../lib/types.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("help me what do I do");

const tips: string[] = [
  "Did you know: Some commands have context menu versions. Try them out by right clicking on a user, and select Apps!"
];

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const commandData = client.commands.map((c: SlashCommand) => c.data);
  const slashCommandData = commandData
    .filter((command: any) => command instanceof SlashCommandBuilder)
    .map((c: any) => `\`${c.name}\``);

  const contextCommandData = commandData
    .filter((command: any) => command instanceof ContextMenuCommandBuilder)
    .map((c: any) => `\`${c.name}\``);

  const fields = [
    {
      name: "Total Commands",
      value: commandData.length.toString()
    },
    {
      name: "Slash Commands",
      value: slashCommandData.join(" ")
    },
    {
      name: "Context Menu Commands",
      value: contextCommandData.join(" ")
    }
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];
  const embed = new EmbedBuilder()
    .setTitle("Help")
    .setDescription(
      `Welcome to Link Master! This bot uses [Slash Commands](https://discord.com/blog/welcome-to-the-new-era-of-discord-apps),
so you can press / to view the commands you can use from
_all_ the bots on this server!\n\n${tip}`)
    .addFields(fields);

  interaction.reply({ embeds: [embed] });
}