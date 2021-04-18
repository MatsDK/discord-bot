import Discord from "discord.js";
import getTimeInMs from "./utils/getTimeInMs";

export default {
  name: "createpoll",
  async execute(client: any, message: any, args: any) {
    let time: any = args[0];

    const regex = new RegExp(/^([0-9]{2}|[0-9]{1})[sSmM]$/);

    if (args.length < 1) return message.reply("Provide a question");

    if (regex.test(time)) {
      const timeMs: any = getTimeInMs(time);
      if (timeMs.err) return message.reply(timeMs.err);
      time = timeMs.ms;

      const question = args.slice(1).join(" ");
      if (!question.trim()) return message.reply("Provide a question");

      const poll = new Discord.MessageEmbed()
        .setTitle(args.slice(1).join(" "))
        .setFooter(`Poll by ${message.author.username}`);

      const msgEmbed = await message.channel.send(poll);

      setTimeout(() => {
        msgEmbed.delete().catch(console.error);
      }, time);

      await msgEmbed.react("✔️");
      await msgEmbed.react("❌");
    } else {
      const question = args.join(" ");
      if (!question.trim()) return message.reply("Provide a question");

      const poll = new Discord.MessageEmbed()
        .setTitle(args.join(" "))
        .setFooter(`Poll by ${message.author.username}`);

      const msgEmbed = await message.channel.send(poll);

      await msgEmbed.react("✔️");
      await msgEmbed.react("❌");
    }
    message.delete();
  },
};
