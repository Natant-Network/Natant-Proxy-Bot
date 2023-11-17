import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import resetUser from "../lib/resetUser.js";
import { userModel } from "../lib/schema.js";

export const data = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Reset Usage")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false)
  .addSubcommand(command => command
    .setName("user")
    .setDescription("Reset usage for a user")
    .addUserOption(option => option
      .setName("user")
      .setDescription("The user to reset")
      .setRequired(true)
    )
  )
  .addSubcommand(command => command
    .setName("all")
    .setDescription("Reset usage for everyone")
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  if(subcommand == "user") {
    const user = interaction.options.getUser("user", true);
    const data = await resetUser(user.id, interaction.guild!.id);
    if(!data.done) return interaction.reply({
      content: "User not found in database!",
      ephemeral: true
    });
    const embed = new EmbedBuilder()
      .setDescription(`✅ Reset usage (${data.oldUsage}) for <@${user.id}>`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  } else if(subcommand == "all") {
    await resetAll(client, interaction);
  }
}

async function resetAll(client: any, interaction: any) {
  /*
  const data = await userModel.find({
    [`guilds.${interaction.guild.id}`]: { $exists: true }
  });
  */
  const data = await userModel.updateMany({
    [`guilds.${interaction.guild.id}`]: { $exists: true }
  }, {
    [`guilds.${interaction.guild.id}.uses`]: 0
  });
  const embed = new EmbedBuilder()
    .setDescription(`${data.acknowledged ? "✅" : "❌"} Reset usage for ${data.modifiedCount} users`);
  interaction.reply({ embeds: [embed] });
}