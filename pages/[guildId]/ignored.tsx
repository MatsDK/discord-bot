import axios from "axios";
import Link from "next/link";
import { Context } from "node:vm";
import Router, { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import { guildDataObj } from "bot/types";

type ignoredChannel = { name: string; id: string };
type bannedMember = { name: string; id: string; reason: string; img: string };
type ignoredUser = { name: string; id: string };

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface IgnoredPageProps {
  ignoredChannels: Array<ignoredChannel>;
  bannedMembers: Array<bannedMember>;
  ignoredUsers: Array<ignoredUser>;
  guildData: guildDataObj;
}

const Ignored: nextFunctionComponent<IgnoredPageProps> = ({
  ignoredChannels,
  bannedMembers,
  ignoredUsers,
  guildData,
}) => {
  const router = useRouter();

  return (
    <Layout guildData={guildData}>
      <Link href={`/${router.query.guildId}`}>Home</Link>
      <h5>Ignored Channels</h5>
      {ignoredChannels.map((_: ignoredChannel, idx: number) => {
        return (
          <div key={idx}>
            <p>{_.name}</p>
          </div>
        );
      })}
      <h5>Ignored Users</h5>
      {ignoredUsers.map((_: ignoredUser, idx: number) => {
        return (
          <div key={idx} style={{ display: "flex" }}>
            <p>{_.name}</p>
          </div>
        );
      })}
      <h5>Banned Members</h5>
      {bannedMembers.map((_: bannedMember, idx: number) => {
        return (
          <div key={idx} style={{ display: "flex" }}>
            <p>{_.name}</p>
            <p>{_.reason}</p>
          </div>
        );
      })}
    </Layout>
  );
};

Ignored.getInitialProps = async ({ res, query }: Context) => {
  const apiRes = await axios({
    method: "GET",
    params: { guildId: query.guildId },
    url: "http://localhost:3001/api/ignored",
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) {
    if (typeof window === "undefined") return res.redirect("/");
    else return Router.push("/");
  }
  return {
    ignoredChannels: apiRes.data.ignoredChannels,
    bannedMembers: apiRes.data.bannedMembers,
    ignoredUsers: apiRes.data.ignoredUsers,
    guildData: apiRes.data.guildData,
  };
};
export default Ignored;
