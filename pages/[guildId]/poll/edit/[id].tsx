import {
  guildDataObj,
  PollOption,
  pollType,
  rolesType,
} from "../../../../bot/types";
import PollForm from "../../../../src/components/PollForm";
import PollOptions from "../../../../src/components/PollOptions";
import axios from "axios";
import { Context } from "node:vm";
import { useState } from "react";
import { checkPoll } from "../../../../src/checkPollOptions";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Layout from "../../../../src/components/Layout";

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface editPollProps {
  poll: pollType;
  roles: Array<rolesType>;
  guildData: guildDataObj;
}

const Edit: nextFunctionComponent<editPollProps> = ({
  poll,
  roles,
  guildData,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>(poll.options);
  const [pollNameInput, setPollNameInput] = useState<string>(poll.name);
  const [pollContentInput, setPollContentInput] = useState<string>(
    poll.content
  );
  const [pollDesriptionInput, setPollDesriptionInput] = useState<string>(
    poll.description
  );
  const router = useRouter();

  const saveChanges = () => {
    const checkPollOptions = checkPoll(
      pollOptions,
      pollContentInput,
      pollNameInput,
      poll.rolePoll
    );
    if (checkPollOptions.err) return alert(checkPollOptions.err);
    setIsSaving(true);

    axios({
      method: "POST",
      url: "http://localhost:3001/api/poll/updatePoll",
      params: { guildId: router.query.guildId },
      data: {
        ...poll,
        name: pollNameInput,
        content: pollContentInput,
        description: pollDesriptionInput,
        options: pollOptions,
      },
    })
      .then((res) => {
        setIsSaving(false);
        if (res.data.err) return alert(res.data.err);
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
      <Link href={`/${router.query.guildId}`}>Home</Link>
      <Link href={`/${router.query.guildId}/poll`}>Polls</Link>
      <PollForm {...PollFormProps} />
      <PollOptions
        setOptions={setPollOptions}
        options={pollOptions}
        withRoles={poll.rolePoll}
        roles={roles}
      />
      {isSaving ? (
        "saving changes..."
      ) : (
        <button onClick={saveChanges}>Save Changes</button>
      )}
    </Layout>
  );
};

Edit.getInitialProps = async ({ query, res }: Context) => {
  const { id, guildId }: { id: string; guildId: string } = query;
  const apiRes = await axios({
    method: "GET",
    params: { guildId },
    url: `http://localhost:3001/api/poll/getPoll/${id}`,
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) {
    if (typeof window === "undefined") return res.redirect("/");
    else return Router.push("/");
  }
  return {
    poll: apiRes.data.data,
    roles: apiRes.data.roles,
    guildData: apiRes.data.guildData,
  };
};

export default Edit;
