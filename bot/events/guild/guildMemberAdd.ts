import { clientState } from "../../../bot/client";
import { clientGuildObj } from "../../../bot/types";

export default async (Discord: any, client: any, member: any) => {
  const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
    member.guild.id
  );

  if (thisGuildObj) {
    const memberRole = member.guild.roles.cache.find(
      (role: any) => role.id === thisGuildObj.memberRoleId
    );
    if (!memberRole) return;

    member.roles.add(memberRole).catch((err: any) => {
      console.log(err);
    });
  }
};
