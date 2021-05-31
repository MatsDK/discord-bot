import {
  channelsType,
  commandType,
  guildDataObj,
  rolesType,
} from "../../../../bot/types";
import NewCommandForm from "../../../../src/components/NewCommandForm";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../../../src/components/Layout";
import styles from "../../../../src/css/commandPage.module.css";

interface newCommandProps {
  prefix: string;
  channels: channelsType[];
  roles: rolesType[];
  cmds: commandType[];
  guildData: guildDataObj;
  redirect?: boolean;
}

const newCommand: React.FC<newCommandProps> = ({
  prefix,
  channels,
  roles,
  guildData,
}) => {
  const router = useRouter();

  const createCommand = (
    keyWordInput: string,
    descriptionInput: string,
    replyInput: string,
    selectedChannels: any,
    selectedRoles: any
  ) => {
    if (!keyWordInput.trim().length || !replyInput.trim().length)
      return alert("Please enter a valid keyword and reply");

    axios({
      method: "POST",
      url: "http://localhost:3001/api/createCmd",
      data: {
        keyWord: keyWordInput.trim(),
        channels: selectedChannels,
        allChannels: selectedChannels.length === channels.length,
        roles: selectedRoles,
        allRoles: selectedRoles.length === roles.length,
        guildId: router.query.guildId,
        description: descriptionInput,
        reply: replyInput,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        router.push(`/${router.query.guildId}`);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Layout guildData={guildData}>
      <div className={styles.newCommandPageHeader}>
        <h1>New Command</h1>
      </div>
      <div className={styles.newCommandContainer}>
        <NewCommandForm
          channels={channels}
          roles={roles}
          create={createCommand}
          prefix={prefix}
        />
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context: any) => {
  const res = await axios({
    method: "GET",
    params: { guildId: context.query.guildId },
    url: "http://localhost:3001/api/getData",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err)
    return {
      redirect: {
        permanent: false,
        destination: `/${context.query.guildId}`,
      },
    };

  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
      channels: res.data.data.channels,
      roles: res.data.data.roles,
      guildData: res.data.data.data,
    },
  };
};

export default newCommand;
