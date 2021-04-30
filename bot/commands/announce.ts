import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          if (
            args[0]?.toLowerCase().trim() == "here" ||
            message.mentions.channels.first()
          ) {
            let targetChannel: any;

            if (args[0]?.toLowerCase().trim() == "here")
              targetChannel = message.channel;
            else targetChannel = message.mentions.channels.first();
            args = args.slice(1, args.length);

            const announceMsg: string = args.join(" ").trim();
            if (!announceMsg) return message.reply("Provide a message");

            targetChannel.send(`**Announcement**\n${announceMsg}`);
          } else
            message.reply(
              "Please mention a channel where you want to announce"
            );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}
