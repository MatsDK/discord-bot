import { prefixState } from "../constants";

export default {
  name: "prefix",
  async execute(client: any, message: any, args: any) {
    if (args.length < 1) return message.reply("Please provide a new prefix");
    if (args[0].trim().length < 1) return message.reply("Invalid prefix");
    prefixState.setPrefix(args[0]);

    message.reply(`Prefix changed to \` ${args[0]} \``);
  },
};
