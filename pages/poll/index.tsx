import { pollType } from "../../bot/types";
import PollsList from "../../src/components/PollsList";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const PollPage = (props: any) => {
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

// PollPage.getInitialProps = async () => {
//   const res = await axios({
//     method: "GET",
//     url: "http://localhost:3001/api/poll/getPolls",
//   }).catch((err) => {
//     console.log(err);
//   });

//   if (!res || res.data.err) return { polls: {} };
//   return {
//     polls: res.data.polls,
//   };
// };

export async function getServerSideProps(context: any) {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/poll/getPolls",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err) return { props: { polls: {} } };
  return {
    props: {
      polls: res.data.polls,
    },
  };
}

export default PollPage;
