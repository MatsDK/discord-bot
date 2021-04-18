export default (Discord: any, client: any, message: any) => {
  client.channels.cache
    .filter((channel: any) => channel.type == "text")
    .forEach((channel: any) => {
      channel.send("Bot is ready");
    });
  console.log("bot is online");
};
