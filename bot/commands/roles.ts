export default {
  keyword: "roles",
  roles: { allRoles: true, consentedRoles: [] },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "BctIqW8XUfwDMxVXmTPFi",
  async execute(client: any, message: any, args: any) {
    const roles: string = Array.from(message.guild.roles.cache)
      .sort((a: any, b: any) => b[1].rawPosition - a[1].rawPosition)
      .map(([key, _]: any) => _.name)
      .map((role: string) => `-${role}`)
      .join(`\n`);

    return message.channel.send(`\n ${roles}`);
  },
};
