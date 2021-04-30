import checkPermission from "../commandUtils/checkPermission";
import Discord from "discord.js";
import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const target = await client.users.fetch(args[0]);

          const { err } = checkPermission(target, message, "BAN_MEMBERS");
          if (err) return message.reply(err);

          const reason = args.slice(1).join(" ") || "Unspecified";
          const embed = new Discord.MessageEmbed()
            .setTitle("Action: Unban")
            .setDescription(
              `UnBanned ${target} (${target.id})\n Reason: ${reason}`
            )
            .setFooter(`UnBanned by ${message.author.username}`);

          message.guild.members.unban(target, reason);
          message.channel.send(embed);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
