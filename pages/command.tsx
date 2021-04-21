import { channelsType, commandType, rolesType } from "@/bot/types";
import NewCommandForm from "@/components/NewCommandForm";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import SelectChannelsContainer from "@/components/SelectChannelsContainer";
import SelectRolesContainer from "@/components/selectRolesContainer";

interface newCommandProps {
  prefix: string;
  channels: channelsType[];
  roles: rolesType[];
  cmds: commandType[];
}

const newCommand = ({ prefix, channels, roles }: newCommandProps) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.map((_: channelsType) => _.id)
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    roles.map((_: rolesType) => _.id)
  );
  const router = useRouter();

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
        allRoles: selectedRoles.length === channels.length,

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
    <div>
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
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  });

  if (res.data.err) return { props: { data: {} } };
  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
      channels: res.data.data.channels,
      roles: res.data.data.roles,
    },
  };
};

export default newCommand;
