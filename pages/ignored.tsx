import axios from "axios";
import Link from "next/link";

type ignoredChannel = { name: string; id: string };

interface IgnoredPageProps {
  ignoredChannels: Array<ignoredChannel>;
  bannedMembers: any[];
}

const Ignored: React.FC<IgnoredPageProps> = ({
  ignoredChannels,
  bannedMembers,
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
    },
  };
}

export default Ignored;
