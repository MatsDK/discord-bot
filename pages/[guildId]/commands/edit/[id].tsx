import {
  channelsType,
  commandType,
  guildDataObj,
  rolesType,
} from "../../../../bot/types";
import SelectChannelsContainer from "../../../../src/components/SelectChannelsContainer";
import SelectRolesContainer from "../../../../src/components/SelectRolesContainer";
import axios from "axios";
import Link from "next/link";
import { Context } from "node:vm";
import { useState } from "react";
import { updateChanges } from "../../../../src/updateCmdChanges";
import Router, { useRouter } from "next/router";
import Layout from "../../../../src/components/Layout";

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface EditPageProps {
  prefix: string;
  channels: Array<channelsType>;
  roles: Array<rolesType>;
  thisCmd: commandType;
  guildData: guildDataObj;
}

const edit: nextFunctionComponent<EditPageProps> = ({
  thisCmd,
  prefix,
  channels,
  roles,
  guildData,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [keywordInput, setKeywordInput] = useState<string>(thisCmd.keyword);
  const [descriptionInput, setDescriptionInput] = useState<string>(
    thisCmd.description
  );
  const [replyInput, setReplyInput] = useState<string>(thisCmd.reply);
  const [selectedChannels, setSelectedChannels] = useState<Array<string>>(
    thisCmd.channels.allChannels
      ? channels.map((_: channelsType) => _.id)
      : thisCmd.channels.allowedChannels
  );
  const [selectedRoles, setSelectedRoles] = useState<Array<string>>(
    thisCmd.roles.allRoles
      ? roles.map((_: rolesType) => _.id)
      : thisCmd.roles.consentedRoles
  );
  const router = useRouter();

  const saveChanges = () => {
    if (!keywordInput.trim().length) return alert("Invalid Keyword!");
    const updatedCmd = updateChanges(
      thisCmd,
      descriptionInput,
      keywordInput,
      replyInput,
      {
        channels: { channels, selectedChannels },
        roles: { roles, selectedRoles },
      }
    );

    setIsSaving(true);
    axios({
      method: "POST",
      url: "http://localhost:3001/api/changeCmd",
      data: { guildId: router.query.guildId, command: updatedCmd },
    })
      .then((res) => {
        setIsSaving(false);
        if (res.data.err) return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout guildData={guildData}>
      <Link href={`/${router.query.guildId}`}>Home</Link>
      <br />
      {prefix}
      <input
        type="text"
        value={keywordInput}
        placeholder="Keyword"
        onChange={(e) => setKeywordInput(e.target.value)}
      />
      <input
        type="text"
        value={descriptionInput}
        placeholder="Description"
        onChange={(e) => setDescriptionInput(e.target.value)}
      />
      {!thisCmd.action && (
        <textarea
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
          placeholder="Reply"
        />
      )}
      <SelectChannelsContainer
        channels={channels}
        setSelectedChannels={setSelectedChannels}
        selectedChannels={selectedChannels}
      />
      <SelectRolesContainer
        roles={roles}
        setSelectedRoles={setSelectedRoles}
        selectedRoles={selectedRoles}
      />
      {isSaving && "Saving changes.."}
      <button onClick={saveChanges}>Save Changes</button>
    </Layout>
  );
};

edit.getInitialProps = async ({ query, res }: Context) => {
  const { id, guildId }: { id: string; guildId: string } = query;
  const apiRes = await axios({
    method: "GET",
    url: `http://localhost:3001/api/getData/${id}`,
    params: { guildId },
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) {
    if (typeof window === "undefined") return res.redirect(`/${guildId}`);
    else return Router.push(`/${guildId}`);
  }

  return {
    thisCmd: apiRes.data.data.thisCmd,
    prefix: apiRes.data.data.prefix,
    channels: apiRes.data.data.channels,
    roles: apiRes.data.data.roles,
    guildData: apiRes.data.data.guildData,
  };
};

export default edit;
