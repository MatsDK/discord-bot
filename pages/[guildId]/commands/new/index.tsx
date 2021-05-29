import {
  channelsType,
  commandType,
  guildDataObj,
  rolesType,
} from "../../../../bot/types";
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
