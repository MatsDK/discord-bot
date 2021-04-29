import { channelsType, commandType, rolesType } from "../bot/types";

export const updateChanges = (
  thisCmd: commandType,
  descriptionInput: string,
  keywordInput: string,
  replyInput: string,
  { channels: { channels, selectedChannels }, roles: { roles, selectedRoles } }
): commandType => {
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
