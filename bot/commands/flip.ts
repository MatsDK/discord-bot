export default {
  keyword: "flip",
  roles: {
    allRoles: true,
    consentedRoles: [],
  },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "or29OAcrJF1qLf9TgFnz7ejj",
  async execute(client: any, message: any, args: any[]) {
    try {
      const ans: string = ["Heads", "Tails"][Math.round(Math.random())];
      message.reply(`The winner is \` ${ans} \``);
    } catch (err) {
      message.reply("An error occured");
    }
  },
};
