const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'close_ticket',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    try {
      const [, , roleID] = interaction.customId.split('_');
      await interaction.deferReply({});
      await interaction.channel.permissionOverwrites.set([
        {
          id: interaction.guildId,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.channel.topic,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: roleID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ]);
      // Embed message confirming ticket closure
      const embed = new EmbedBuilder()
        .setColor('#ff5555')
        .setTitle('تم إغلاق التذكرة')
        .setDescription('تم إغلاق هذه التذكرة. انقر على الزر أدناه إذا كنت ترغب في حذف هذه التذكرة.');

      // Button to confirm ticket deletion
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('delete_ticket').setLabel('حذف التذكرة').setStyle(ButtonStyle.Secondary),
      );
      interaction.message.components[0].components[0].data.disabled = true;
      interaction.message.components[0].components[1].data.disabled = true;
      interaction.message.edit({ components: interaction.message.components });
      // Send embed and button
      await interaction.editReply({ embeds: [embed], components: [row] });
      const user = await interaction.guild.members.fetch(interaction.channel.topic).catch(() => {});
      // Create an embed with information about the closed ticket
      const userEmbed = new EmbedBuilder()
        .setTitle('تم اغلاق تذكرتك') // replaced locale.confirmYes.ticketClosed
        .setColor('#05131f')
        .addField('فتح التذكرة', `<@${interaction.channel.topic}>`, true) // replaced locale.confirmYes.openedBy
        .addField('اغلق التذكرة', `<@${interaction.user.id}>`, true) // replaced locale.confirmYes.closedBy
        .addField('وقت فتح التذكرة', new Date(interaction.channel.createdTimestamp).toLocaleString(), true) // replaced locale.confirmYes.openTime
        .addField('وقت اغلاق التذكرة', new Date().toLocaleString(), true); // replaced locale.confirmYes.closeTime

      if (user) user.send({ embeds: [userEmbed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply({ content: 'حدث خطأ أثناء إغلاق التذكرة.', ephemeral: true });
    }
  },
};
