import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const types: string[] = ["text", "voice"];
          if (!types.includes(args[0]?.toLowerCase().trim()))
            return message.reply("First argument should be Text or Voice");

          const newChannelType = args[0].toLowerCase().trim(),
            newChannelName = args.splice(1).join(" ");

          if (!newChannelName)
            return message.reply("Please enter a valid name");

          const channel = await message.guild.channels.create(newChannelName, {
            type: newChannelType,
            permissionOverwrites: [
              {
                id: message.guild.id,
                allow: ["VIEW_CHANNEL"],
              },
            ],
          });

          message.reply(`Create channel <#${channel.id}>`);
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}
