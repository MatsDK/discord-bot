import { guildDataObj, pollType } from "../../../bot/types";
import PollsList from "../../../src/components/PollsList";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../../src/components/Layout";
import { useRouter } from "next/router";

interface PollPageProps {
  polls: pollType[];
  guildData: guildDataObj;
}

const PollPage: React.FC<PollPageProps> = ({ polls, guildData }) => {
  const [pollsArr] = useState<Array<pollType>>(
    Object.keys(polls).map((key: any) => polls[key])
  );
  const router = useRouter();

  return (
    <Layout guildData={guildData}>
      <Link href={`/${router.query.guildId}`}>Home</Link>
      <Link href={`/${router.query.guildId}/poll/new`}>new poll</Link>
      list of polls
      <PollsList polls={pollsArr} />
    </Layout>
  );
};

export const getServerSideProps = async (context: any) => {
  const res = await axios({
    method: "GET",
    params: { guildId: context.query.guildId },
    url: "http://localhost:3001/api/poll/getPolls",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err) return { props: { polls: {} } };
  return {
    props: {
      polls: res.data.polls,
      guildData: res.data.data,
    },
  };
};

export default PollPage;
