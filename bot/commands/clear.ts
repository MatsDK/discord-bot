export = {
  name: "clear",
  async execute(client: any, msg: any, args: any) {
    if (args[0] === "info")
      return msg.reply(
        "Use the clear command to delete messages send in the last 14 days."
      );

    if (args.length < 1) return msg.reply("First argument should be a number");

    const limit: any = parseInt(args[0]);
    if (isNaN(limit))
      return msg.reply(`First argument should be a number. You gave ${limit}`);

    if (limit >= 100) return msg.reply(`You can delete maximum 99 messages`);

    const messages = await msg.channel.messages.fetch({ limit: limit + 1 });
    msg.channel.bulkDelete(messages);

    msg.reply(`Deleted \` ${limit} \` messages.`);
  },
};
