import { pollType } from "@/bot/types";
import PollsList from "@/components/components/PollsList";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const index = (props: any) => {
  const [polls] = useState<Array<pollType>>(
    Object.keys(props.polls).map((key: any) => props.polls[key])
  );

  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/poll/new">new poll</Link>
      list of polls
      <PollsList polls={polls} />
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/poll/getPolls",
  });

  if (res.data.err) return { props: { polls: {} } };
  return {
    props: {
      polls: res.data.polls,
    },
  };
};

export default index;
