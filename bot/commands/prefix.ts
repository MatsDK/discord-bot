import { prefixState } from "../constants";

export default {
  keyword: "prefix",
  roles: {
    allRoles: false,
    consentedRoles: ["831232420425498675", "831232473144754307"],
  },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "3gZU3hIXFDr4P_JnKzSf9",
  async execute(client: any, message: any, args: any) {
    if (args.length < 1) return message.reply("Please provide a new prefix");
    if (args[0].trim().length < 1) return message.reply("Invalid prefix");
    prefixState.setPrefix(args[0]);

    message.reply(`Prefix changed to \` ${args[0]} \``);
  },
};
