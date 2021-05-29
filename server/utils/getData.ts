import { channelsType, clientGuildObj, rolesType } from "../../bot/types";
import { getGuildObj } from "./getGuildObjs";

export const getData = async (guildId: string, client: any) => {
  const thisGuild = client.guilds.cache.get(guildId);
  if (!thisGuild) return { channelsArr: [], rolesArr: [] };

  const channelsArr: channelsType[] = Array.from(
    thisGuild.channels.cache
      .filter((channel: any) => channel.type === "text")
      .entries()
  ).map(([_, value]: any) => ({ name: value.name, id: value.id }));

  const rolesArr: rolesType[] = Array.from(thisGuild.roles.cache.entries()).map(
    ([_, value]: any) => ({
      id: value.id,
      name: value.name,
      color: value.color,
      rawPosition: value.rawPosition,
    })
  );

  const thisGuildObj: clientGuildObj = client.guildObjs.get(guildId),
    guilds = await getGuildObj(client);

  return {
    channelsArr,
    rolesArr,
    data: {
      thisGuild: {
        imgURL: thisGuild.iconURL(),
        name: thisGuild.name,
        active: thisGuildObj?.isActive,
        id: thisGuild.id,
      },
      guilds: guilds || [],
    },
  };
};
