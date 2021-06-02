import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { guildDataObj, PollOption, rolesType } from "../../../bot/types";
import PollOptions from "../../../src/components/PollOptions";
import axios from "axios";
import { useRouter } from "next/router";
import PollForm from "../../../src/components/PollForm";
import { checkPoll } from "../../../src/checkPollOptions";
import Router from "next/router";
import Layout from "../../../src/components/Layout";
import styles from "../../../src/css/pollsPage.module.css";
import { useInput } from "src/hooks/useInput";

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
  const [pollNameInput, setPollNameInput] = useInput<string>("");
  const [pollContentInput, setPollContentInput] = useInput<string>("");
  const [pollDesriptionInput, setPollDesriptionInput] = useInput<string>("");
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
      <div className={styles.newPollHeader}>
        <h1>New Poll</h1>
      </div>
      <div className={styles.newPollPageContainer}>
        <PollForm {...PollFormProps} />
        <label>Options</label>
        <div>
          <div className={styles.isRolePollCheckbox}>
            <span>Role Poll</span>
            <input
              type="checkbox"
              defaultChecked={isRolePoll}
              onChange={(e) => setIsRolePoll(e.target.checked)}
            />
          </div>
          <PollOptions
            options={pollOptions}
            setOptions={setPollOptions}
            withRoles={isRolePoll}
            roles={roles}
          />
        </div>

        <button className={styles.saveButton} onClick={savePoll}>
          Save Poll
        </button>
      </div>
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
