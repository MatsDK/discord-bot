export default {
  keyword: "members",
  roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "wxbuwBLwgrO--lcvAYSbeG",
  async execute(client: any, message: any, args: any) {
    try {
      if (!args[0] || !args[0]?.trim().length)
        return message.reply(
          "Provide a role where you want to list members from"
        );

      const roleName: string = args.join(" ").trim();
      const thisRole: any = message.guild.roles.cache.find(
        (_: any) =>
          _.id === roleName || _.name.toLowerCase() === roleName.toLowerCase()
      );
      if (!thisRole) return message.reply("Role not found");

      const members = await message.guild.members.fetch();
      const membersWithRole: Array<any> = members.filter(
        (_: any) => !!_.roles.cache.some((role: any) => role.id === thisRole.id)
      );

      message.channel.send(
        `
        ${[
          `Members with role \` ${thisRole.name} \`: `,
          Array.from(membersWithRole)
            .map(([key, member]: any) => `**${member.user.username}**`)
            .join(",  "),
        ].join(" \n")}`
      );
    } catch (err) {
      console.log(err);
      message.reply("An error occured");
    }
  },
};
