import Discord from "discord.js";
import checkPermission from "./utils/checkPermission";

export default {
  keyword: "kick",
  roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "xbuwBLwgrO--lcvAYSbeG",
  async execute(client: any, message: any, args: any) {
    try {
      const target = message.mentions.members.first();

      const { err } = checkPermission(target, message, "KICK_MEMBERS");
      if (err) message.reply(err);

      const embed = new Discord.MessageEmbed()
        .setTitle("Action: Kick")
        .setDescription(`Kicked ${target} (${target.id})`)
        .setFooter(`Kicked by ${message.author.username}`);
      message.channel.send(embed);

      target.kick(args[1] || "Unspecified");
    } catch (err) {
      message.reply("An error occured");
    }
  },
};