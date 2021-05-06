import axios from "axios";
import Link from "next/link";

type ignoredChannel = { name: string; id: string };
type bannedMember = { name: string; id: string; reason: string; img: string };
type ignoredUser = { name: string; id: string };

interface IgnoredPageProps {
  ignoredChannels: Array<ignoredChannel>;
  bannedMembers: Array<bannedMember>;
  ignoredUsers: Array<ignoredUser>;
}

const Ignored: React.FC<IgnoredPageProps> = ({
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

export async function getServerSideProps(context: any) {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/ignored",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err)
    return { props: { ignoredChannels: [], bannedMembers: [] } };
  return {
    props: {
      ignoredChannels: res.data.ignoredChannels,
      bannedMembers: res.data.bannedMembers,
      ignoredUsers: res.data.ignoredUsers,
    },
  };
}

export default Ignored;
