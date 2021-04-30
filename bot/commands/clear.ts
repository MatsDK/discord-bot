import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        if (args[0] === "info")
          return message.reply(
            "Use the clear command to delete messages send in the last 14 days.\n First argument should be the number of messages you want to delete (min: 1, max: 99)"
          );

        if (args.length < 1)
          return message.reply("First argument should be a number");

        const limit: any = parseInt(args[0]);
        if (isNaN(limit))
          return message.reply(
            `First argument should be a number. You gave ${limit}`
          );

        if (limit >= 100 || limit < 1)
          return message.reply(`You should enter a number between 0 and 100`);

        const messages = await message.channel.messages.fetch({
          limit: limit + 1,
        });
        message.channel.bulkDelete(messages);

        message.reply(`Deleted \` ${limit} \` messages.`);
      }
    );
  }
}
