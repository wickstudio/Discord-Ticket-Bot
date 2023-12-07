const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
  ButtonStyle,
  CommandInteraction,
  PermissionsBitField,
} = require('discord.js');

module.exports = {
  name: 'setup',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('إعداد رسالة إنشاء التذاكر')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
  /**
   * @param {CommandInteraction}  interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    await interaction.deferReply({ ephemeral: true });
    const Attachment = new AttachmentBuilder(config.BACKGROUND, { name: 'background.png' });
    const row = new ActionRowBuilder().addComponents(
      ...config.SECTIONS.map((section) =>
        new ButtonBuilder()
          .setCustomId(`create_ticket*_${config.SECTIONS.indexOf(section)}`)
          .setLabel(section.name)
          .setStyle(ButtonStyle.Primary),
      ),
    );
    await interaction.channel.send({ files: [Attachment], components: [row] });
    await interaction.editReply({ content: 'تم إرسال رسالة إعداد التذكرة.', ephemeral: true });
  },
};
