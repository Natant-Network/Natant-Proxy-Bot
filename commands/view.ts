import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import viewUser from "../lib/viewUser.js";

export const data = new SlashCommandBuilder()
  .setName("view")
  .setDescription("View a user\'s usage")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false)
  .addUserOption(option => option
    .setName("user")
    .setDescription("The user to view")
    .setRequired(true)
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser("user", true);
  // @ts-ignore
  const gid: string = interaction.guild.id;
  const data = await viewUser(user, gid);
  interaction.reply(data);
}