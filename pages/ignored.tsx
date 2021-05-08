import axios from "axios";
import Link from "next/link";
import { Context } from "node:vm";
import Router from "next/router";

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
}

const Ignored: nextFunctionComponent<IgnoredPageProps> = ({
  ignoredChannels,
  bannedMembers,
  ignoredUsers,
}) => {
  return (
    <div>
      <Link href="/">Home</Link>
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
    </div>
  );
};

Ignored.getInitialProps = async ({ res }: Context) => {
  const apiRes = await axios({
    method: "GET",
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
  };
};
export default Ignored;
