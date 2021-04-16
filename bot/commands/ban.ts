import Discord from "discord.js";
import checkPermission from "./utils/checkPermission";

export default {
  name: "ban",
  async execute(client: any, message: any, args: any) {
    try {
      const target = message.mentions.members.first();
      const { err } = checkPermission(target, message, args);
      if (err) message.reply(err);

      const embed = new Discord.MessageEmbed()
        .setTitle("Action: Ban")
        .setDescription(`Banned ${target} (${target.id})`)
        .setFooter(`Banned by ${message.author.username}`);
      message.channel.send(embed);

      target.ban({ reason: args[1], days: 7 }).catch((err: any) => {
        console.log(err);
      });
    } catch (err) {
      message.reply("An error occured");
    }
  },
};
