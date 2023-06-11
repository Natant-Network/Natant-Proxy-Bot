import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('panel')
  .setDescription('Create a proxy panel')
  .setDefaultMemberPermissions('8')
  .setDMPermission(false);

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const types = new TextInputBuilder()
    .setCustomId('proxyTypesInput')
    .setLabel('The proxy types, separated by a comma. Max 5')
    .setPlaceholder('Example: type1,type2')
    .setStyle(TextInputStyle.Short);

  const message = new TextInputBuilder()
    .setCustomId('proxyCustomMessage')
    .setLabel('A custom message to display on the panel')
    .setValue('Press one of the buttons to get a proxy')
    .setMaxLength(2048)
    .setStyle(TextInputStyle.Paragraph);
  
  const modal = new ModalBuilder()
		.setCustomId('panel')
		.setTitle('Create a proxy panel')
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(types),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(message)
    );
  interaction.showModal(modal);
}

export async function modal(client: any, interaction: any) {
  const types = interaction.fields.getTextInputValue('proxyTypesInput').split(',').slice(0, 5);
  const row = new ActionRowBuilder();
  const embed = new EmbedBuilder()
    .setTitle('Proxy Panel')
    .setDescription(interaction.fields.getTextInputValue('proxyCustomMessage'));
  
  for(const type of types) {
    row.addComponents(new ButtonBuilder()
      .setCustomId(`$LM_TYPE$:${type}`)
			.setLabel(type)
			.setStyle(ButtonStyle.Primary)
    )
  }
  interaction.reply({ embeds: [embed], components: [row] });
}