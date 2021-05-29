import { channelsType, commandType, rolesType } from "../../../../bot/types";
import NewCommandForm from "../../../../src/components/NewCommandForm";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import SelectChannelsContainer from "../../../../src/components/SelectChannelsContainer";
import SelectRolesContainer from "../../../../src/components/SelectRolesContainer";
import Layout from "../../../../src/components/Layout";

interface newCommandProps {
  prefix: string;
  channels: channelsType[];
  roles: rolesType[];
  cmds: commandType[];
  redirect?: boolean;
}

const newCommand: React.FC<newCommandProps> = ({ prefix, channels, roles }) => {
  const router = useRouter();
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.map((_: channelsType) => _.id)
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    roles.map((_: rolesType) => _.id)
  );

  const createCommand = (
    keyWordInput: string,
    descriptionInput: string,
    replyInput: string
  ) => {
    axios({
      method: "POST",
      url: "http://localhost:3001/api/createCmd",
      data: {
        keyWord: keyWordInput.trim(),
        channels: selectedChannels,
        allChannels: selectedChannels.length === channels.length,
        roles: selectedRoles,
        allRoles: selectedRoles.length === roles.length,

        description: descriptionInput,
        reply: replyInput,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        router.push("/");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Layout guildData={{}}>
      <NewCommandForm create={createCommand} prefix={prefix} />
      <h3>Channels</h3>
      <SelectChannelsContainer
        channels={channels}
        setSelectedChannels={setSelectedChannels}
        selectedChannels={selectedChannels}
      />
      <h3>Roles</h3>
      <SelectRolesContainer
        roles={roles}
        setSelectedRoles={setSelectedRoles}
        selectedRoles={selectedRoles}
      />
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };

  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
      channels: res.data.data.channels,
      roles: res.data.data.roles,
    },
  };
}

export default newCommand;
