export default async (Discord: any, client: any, member: any) => {
  const memberRole = member.guild.roles.cache.find(
    (role: any) => role.name.toLowerCase() === "member"
  );
  if (!memberRole) return;

  member.roles.add(memberRole).catch((err: any) => {
    console.log(err);
  });
};
