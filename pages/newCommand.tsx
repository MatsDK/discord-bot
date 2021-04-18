import { channelsType, commandType, rolesType } from "@/bot/types";
import NewCommandForm from "@/components/NewCommandForm";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";

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
      {channels.map((_: channelsType, idx: number) => {
        const active: boolean = !!selectedChannels.find(
          (channelId: string) => channelId === _.id
        );

        return (
          <div
            style={{ color: active ? "blue" : "black" }}
            key={idx}
            onClick={() => {
              const i: number = selectedChannels.indexOf(_.id);
              if (i < 0)
                setSelectedChannels((selectedChannels) => [
                  _.id,
                  ...selectedChannels,
                ]);
              else
                setSelectedChannels((selectedChannels) =>
                  selectedChannels.filter(
                    (_: string, index: number) => index !== i
                  )
                );
            }}
          >
            {_.name}
          </div>
        );
      })}
      <h3>Roles</h3>
      {roles
        .sort((a: rolesType, b: rolesType) => b.rawPosition - a.rawPosition)
        .map((_: rolesType, idx: number) => {
          const active: boolean = !!selectedRoles.find(
            (channelId: string) => channelId === _.id
          );

          return (
            <div
              key={idx}
              style={{ color: active ? "blue" : "black" }}
              onClick={() => {
                const i: number = selectedRoles.indexOf(_.id);
                if (i < 0)
                  setSelectedRoles((selectedRoles) => [_.id, ...selectedRoles]);
                else
                  setSelectedRoles((selectedRoles) =>
                    selectedRoles.filter(
                      (_: string, index: number) => index !== i
                    )
                  );
              }}
            >
              {_.name}
            </div>
          );
        })}
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
