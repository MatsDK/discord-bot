import { guildDataObj, pollType } from "../../../bot/types";
import PollsList from "../../../src/components/PollsList";
import axios from "axios";
import { useState } from "react";
import Layout from "../../../src/components/Layout";
import styles from "../../../src/css/pollsPage.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

interface PollPageProps {
  polls: pollType[];
  guildData: guildDataObj;
}

const PollPage: React.FC<PollPageProps> = ({ polls, guildData }) => {
  const [pollsArr] = useState<Array<pollType>>(
    Object.keys(polls).map((key: any) => polls[key])
  );
  const router = useRouter();
  const { guildId } = router.query;

  return (
    <Layout guildData={guildData}>
      <div className={styles.pollPageHeader}>
        <h1>Polls</h1>
        <Link href={`/${guildId}/poll/new`}>
          <button>New Command</button>
        </Link>
      </div>
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
