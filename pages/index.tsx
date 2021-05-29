import axios from "axios";
import { guildData } from "bot/types";
import Link from "next/link";

const index: React.FC<{ data: guildData[] }> = ({ data }) => {
  return (
    <div>
      {data.map((_: guildData, idx: number) => (
        <Link href={`/${_.guildId}`} key={idx}>
          {_.name}
        </Link>
      ))}
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getGuilds",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err)
    return { props: { cmds: {}, prefix: "", data: { guilds: [] } } };
  return {
    props: {
      data: res.data.guilds,
    },
  };
};

export default index;
