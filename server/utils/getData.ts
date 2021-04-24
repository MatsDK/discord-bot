import { channelsType, rolesType } from "../../bot/types";

export const getData = (client: any) => {
  const channelsArr: channelsType[] = Array.from(
    client.channels.cache
      .filter((channel: any) => channel.type === "text")
      .entries()
  ).map(([_, value]: any) => ({ name: value.name, id: value.id }));

  const rolesArr: rolesType[] = Array.from(
    client.guilds.cache.first().roles.cache.entries()
  ).map(([_, value]: any) => ({
    id: value.id,
    name: value.name,
    color: value.color,
    rawPosition: value.rawPosition,
  }));

  return { channelsArr, rolesArr };
};
