import checkPermission from "./utils/checkPermission";
import Discord from "discord.js";

export default {
  keyword: "unban",
  roles: {
    allRoles: false,
    consentedRoles: ["831232420425498675", "831232473144754307"],
  },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "Unban banned user",
  reply: "",
  id: "PDdER0-XF0La0hZ1NHojg",
  async execute(client: any, message: any, args: any) {
    try {
      const target = await client.users.fetch(args[0]);

      const { err } = checkPermission(target, message, "BAN_MEMBERS");
      if (err) return message.reply(err);

      const reason = args.slice(1).join(" ") || "Unspecified";
      const embed = new Discord.MessageEmbed()
        .setTitle("Action: Unban")
        .setDescription(`UnBanned ${target} (${target.id})\n Reason: ${reason}`)
        .setFooter(`UnBanned by ${message.author.username}`);

      message.guild.members.unban(target, reason);
      message.channel.send(embed);
    } catch (err) {
      message.reply("An error occured");
    }
  },
};
