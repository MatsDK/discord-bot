import { channelsType, commandType, rolesType } from "@/bot/types";
import SelectChannelsContainer from "@/components/SelectChannelsContainer";
import SelectRolesContainer from "@/components/SelectRolesContainer";
import axios from "axios";
import Link from "next/link";
import { Context } from "node:vm";
import { useState } from "react";

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface EditPageProps {
  prefix: string;
  channels: Array<channelsType>;
  roles: Array<rolesType>;
  thisCmd: commandType;
}

const edit: nextFunctionComponent<EditPageProps> = ({
  thisCmd,
  prefix,
  channels,
  roles,
}) => {
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

  const updateChanges = () => {
    thisCmd.description = descriptionInput;
    thisCmd.keyword = keywordInput;
    thisCmd.reply = replyInput;

    if (
      roles.length === selectedRoles.length &&
      roles.every(
        (_: rolesType) => thisCmd.roles.allRoles || selectedRoles.includes(_.id)
      )
    ) {
      thisCmd.roles.allRoles = true;
      thisCmd.roles.consentedRoles = [];
    } else {
      thisCmd.roles.allRoles = false;
      thisCmd.roles.consentedRoles = selectedRoles;
    }
    if (
      channels.length === selectedChannels.length &&
      channels.every(
        (_: channelsType) =>
          thisCmd.channels.allChannels || selectedChannels.includes(_.id)
      )
    ) {
      thisCmd.channels.allChannels = true;
      thisCmd.channels.allowedChannels = [];
    } else {
      thisCmd.channels.allChannels = false;
      thisCmd.channels.allowedChannels = selectedChannels;
    }

    return thisCmd;
  };

  const saveChanges = () => {
    if (!keywordInput.trim().length) return alert("Invalid Keyword!");
    const updatedCmd = updateChanges();

    axios({
      method: "POST",
      url: "http://localhost:3001/api/changeCmd",
      data: { command: updatedCmd },
    })
      .then((res) => {
        if (res.data.err) return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Link href="/">Home</Link>
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
      <textarea
        value={replyInput}
        onChange={(e) => setReplyInput(e.target.value)}
        placeholder="Reply"
      />
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
      <button onClick={saveChanges}>Save Changes</button>
    </div>
  );
};

edit.getInitialProps = async ({ query, res }: Context) => {
  const { id }: { id: string } = query;
  const apiRes = await axios({
    method: "GET",
    url: `http://localhost:3001/api/getData/${id}`,
  });

  if (apiRes.data.err) return res.redirect("/");
  return {
    thisCmd: apiRes.data.data.thisCmd,
    prefix: apiRes.data.data.prefix,
    channels: apiRes.data.data.channels,
    roles: apiRes.data.data.roles,
  };
};

export default edit;
