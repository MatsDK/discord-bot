export default (Discord: any, client: any, message: any) => {
  client.channels.cache
    .filter((channel: any) => channel.type == "text")
    .forEach((channel: any) => {
      channel.send("hello world");
    });
  console.log("bot is online");
};
