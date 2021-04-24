import Discord from "discord.js";
import checkPermission from "./utils/checkPermission";
import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
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
      }
    );
  }
}
