import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const slowTime = parseInt(args[0]?.trim() || "");

          if (slowTime == null || isNaN(slowTime))
            return message.reply("Please give a time in seconds");

          if (message.channel.type !== "text") return;

          if (!message.member.hasPermission("MANAGE_CHANNELS"))
            return message.reply("You don't have permissions to set slowmode");

          if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
            return message.reply("I don't have permissions to set slowmode");

          const channel = await message.channel.setRateLimitPerUser(slowTime);
          message.channel.send(
            `**Now a user can send a message every  \` ${channel.rateLimitPerUser} seconds \`**`
          );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}
