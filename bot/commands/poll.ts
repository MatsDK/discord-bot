import Discord from "discord.js";

export default {
  name: "poll",
  async execute(client: any, message: any, args: any) {
    const poll = new Discord.MessageEmbed()
      .setTitle("this is a poll")
      .setDescription("test description")
      .setColor("BLUE");

    let msgEmbed = await message.channel.send(poll);
    await msgEmbed.react("👍");
    await msgEmbed.react("👎");
  },
};
