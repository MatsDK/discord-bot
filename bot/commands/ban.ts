import Discord from "discord.js";
import checkPermission from "./utils/checkPermission";
import conf from "../conf.json";

export default {
  keyword: "ban",
  roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "awtHboWkr4khiS3C8hcqS",
  async execute(client: any, message: any, args: any) {
    try {
      const target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

      const { err } = checkPermission(target, message, "BAN_MEMBERS");
      if (err) return message.reply(err);

      const reason: string = args.slice(1).join(" ") || "Unspecified";
      const embed = new Discord.MessageEmbed()
        .setTitle("Action: Ban")
        .setDescription(`Banned ${target} (${target.id})\n Reason: ${reason}`)
        .setFooter(`Banned by ${message.author.username}`);

      target
        .ban({ reason, days: conf.defaultBanDuration })
        .catch((err: any) => {
          console.log(err);
          message.reply("An error occured");
        });

      message.channel.send(embed);
    } catch (err) {
      console.log(err);
      message.reply("An error occured");
    }
  },
};
