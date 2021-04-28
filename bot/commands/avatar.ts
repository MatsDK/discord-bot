import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";
import Discord from "discord.js";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const target =
            message.mentions.members.first() ||
            message.guild.members.cache.find((_: any) => _.id === args[0]);
          if (!target) return message.reply("Please mention a user");

          if (!target.user.avatarURL()) return;
          const embed = new Discord.MessageEmbed()
            .setTitle(`${target.user.tag}'s avatar`)
            .setImage(target.user.avatarURL());

          message.channel.send(embed);
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}
