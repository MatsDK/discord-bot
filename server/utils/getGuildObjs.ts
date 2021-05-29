import { clientGuildObj, dbGuildType, guildData } from "../../bot/types";
import guildBot from "../../server/db/models/guildBot";

export const getGuildObj = async (client: any): Promise<Array<guildData>> => {
  let guilds: dbGuildType[] = await guildBot.find();
  if (!Array.isArray(guilds)) guilds = [guilds];

  const guildsDataArr: guildData[] = guilds.map((_: dbGuildType) => {
    const thisGuild = client.guilds.cache.get(_.guildId),
      thisGuildObj: clientGuildObj = client.guildObjs.get(_.guildId);

    return {
      active: thisGuildObj?.isActive || false,
      name: thisGuild?.name || "",
      imgURL: thisGuild?.iconURL() || "",
      guildId: _.guildId,
    };
  });

  return guildsDataArr;
};
