import Link from "next/link";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { guildDataObj, PollOption, rolesType } from "../../../bot/types";
import PollOptions from "../../../src/components/PollOptions";
import axios from "axios";
import { useRouter } from "next/router";
import PollForm from "../../../src/components/PollForm";
import { checkPoll } from "../../../src/checkPollOptions";
import Router from "next/router";
import Layout from "src/components/Layout";

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface NewPollPageProps {
  roles: Array<rolesType>;
  guildData: guildDataObj;
}

const newPollPage: nextFunctionComponent<NewPollPageProps> = ({
  guildData,
  roles,
}) => {
  const router = useRouter();
  const [isRolePoll, setIsRolePoll] = useState<boolean>(false);
  const [pollNameInput, setPollNameInput] = useState<string>("");
  const [pollContentInput, setPollContentInput] = useState<string>("");
  const [pollDesriptionInput, setPollDesriptionInput] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { text: "yes", emoji: "✔" },
    { text: "No", emoji: "❌" },
  ]);

  const savePoll = () => {
    const checkPollOptions = checkPoll(
      pollOptions,
      pollContentInput,
      pollContentInput,
      isRolePoll
    );
    if (checkPollOptions.err) return alert(checkPollOptions.err);

    axios({
      method: "POST",
      url: "http://localhost:3001/api/poll/newPoll",
      data: {
        guildId: router.query.guildId,
        rolePoll: isRolePoll,
        name: pollNameInput,
        content: pollContentInput,
        description: pollDesriptionInput,
        hadDuration: false,
        duration: 0,
        options: pollOptions,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        router.push(`/${router.query.guildId}/poll`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PollFormProps = {
    updateFuncs: {
      setPollNameInput,
      setPollContentInput,
      setPollDesriptionInput,
    },
    inputs: { pollNameInput, pollContentInput, pollDesriptionInput },
  };

  return (
    <Layout guildData={guildData}>
      <Link href={`/${router.query.guildId}/poll`}>Polls</Link>
      <Link href={`/${router.query.guildId}`}>Home</Link>
      <label>Is role poll</label>
      <input
        type="checkbox"
        defaultChecked={isRolePoll}
        onChange={(e) => setIsRolePoll(e.target.checked)}
      />

      <PollForm {...PollFormProps} />
      <PollOptions
        options={pollOptions}
        setOptions={setPollOptions}
        withRoles={isRolePoll}
        roles={roles}
      />

      <button onClick={savePoll}>Save Poll</button>
    </Layout>
  );
};

newPollPage.getInitialProps = async ({ res, query: { guildId } }: any) => {
  const apiRes = await axios({
    method: "GET",
    params: { guildId },
    url: "http://localhost:3001/api/getData",
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) {
    if (typeof window === "undefined") return res.redirect(`/${guildId}/poll`);
    else return Router.push(`/${guildId}/poll`);
  }
  return {
    roles: apiRes.data.data.roles,
    guildData: apiRes.data.data.data,
  };
};

export default newPollPage;
