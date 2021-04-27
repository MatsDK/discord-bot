import { pollType } from "@/bot/types";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const index = (props: any) => {
  const [polls] = useState<Array<pollType>>(
    Object.keys(props.polls).map((key: any) => props.polls[key])
  );

  return (
    <div>
      <Link href="/poll/new">new poll</Link>
      list of polls
      {polls.map((_: pollType, idx: number) => {
        return (
          <div key={idx} style={{ display: "flex" }}>
            <p>{_.name}</p>
            <p>{_.description}</p>
            <p>{_.options.length} options</p>
          </div>
        );
      })}
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
