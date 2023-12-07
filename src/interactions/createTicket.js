const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  PermissionsBitField,
  ButtonStyle,
  ChannelType,
  AttachmentBuilder,
  CategoryChannel,
} = require("discord.js");
const fs = require("fs");
module.exports = {
  name: "create_ticket",
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    const { guild, user } = interaction;
    const [, , id] = interaction.customId.split("_");
    await interaction.deferReply({ ephemeral: true });
    try {
      const ticketCategory = interaction.guild.channels.cache.get(
        config.ticketCategoryID
      );

      if (!ticketCategory) {
        return;
      }
      const hasTicket = await ticketCategory.children.cache.find(
        (ch) => ch.topic == interaction.user.id
      );
      if (hasTicket) {
        interaction.editReply({
          content: "لديك تذكرة بالفعل",
          ephemeral: true,
        });
        return;
      }

      const { roleID, image } = config.SECTIONS[Number(id)];
      config.ticketNumber++;
      fs.writeFileSync("config.json", JSON.stringify(config, 0, 1), () => {});
      // Create a new channel for the ticket
      const ticketChannel = await guild.channels.create({
        name: `ticket-${config.ticketNumber}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryID, // Optional: Set a parent category for tickets
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: roleID,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
      const Attachment = new AttachmentBuilder(image, { name: "ticket.png" });

      // Buttons for ticket actions
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`close_ticket*_${roleID}`)
          .setLabel("إغلاق التذكرة")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`claim_ticket`)
          .setLabel("استلام التذكرة")
          .setStyle(ButtonStyle.Secondary)
      );

      // Send an initial message in the ticket channel
      ticketChannel.send({
        files: [Attachment],
        content: `**مرحباً بك في تذكرة الدعم الخاصة بك, <@${user.id}>. سيساعدك عضو من <@&${roleID}> قريباً.**`,
        components: [row],
      });

      await interaction.editReply({
        content: `تم إنشاء التذكرة! يرجى التحقق من ${ticketChannel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error creating a ticket channel:", error);
      await interaction.editReply({
        content: "حدث خطأ أثناء إنشاء التذكرة!",
        ephemeral: true,
      });
    }
  },
};
