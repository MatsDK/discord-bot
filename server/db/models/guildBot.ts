import mongoose, { Schema } from "mongoose";

const guildBotSchema = new Schema({
  setup: { type: Boolean, default: false },
  guildId: { type: String, required: true, unique: true },
  isActive: { type: Boolean },
  prefix: { type: String, default: "!" },
  defaultMuteDuration: { type: Number, default: 86400000 },
  defaultBanDuration: { type: Number, default: 7 },
  mutedRoleId: { type: String },
  memberRoleId: { type: String },
  modeRoleId: { type: String },
  ignoredChannels: [{ type: String }],
  ignoredUsers: [{ type: String }],
  polls: [
    {
      rolePoll: { type: Boolean, default: false },
      name: { type: String },
      content: { type: String },
      description: { type: String },
      duration: { type: Number, default: 0 },
      hasDuration: { type: Boolean, default: false },
      id: { type: String },
      options: [
        {
          text: { type: String },
          emoji: { type: String },
          id: { type: String, required: false },
        },
      ],
    },
  ],
  commands: [
    {
      keyword: { type: String },
      description: { type: String },
      roles: {
        allRoles: { type: Boolean, default: true },
        consentedRoles: [{ type: String }],
      },
      channels: {
        allChannles: { type: Boolean, default: true },
        allowedChannels: [{ type: String }],
      },
      action: { type: Boolean, default: false },
      reply: { type: String },
      id: { type: String },
    },
  ],
  actions: [
    {
      keyword: { type: String },
      description: { type: String },
      roles: {
        allRoles: { type: Boolean, default: true },
        consentedRoles: [{ type: String }],
      },
      channels: {
        allChannles: { type: Boolean, default: true },
        allowedChannels: [{ type: String }],
      },
      action: { type: Boolean, default: true },
      reply: { type: String },
      id: { type: String },
      fileName: { type: String },
    },
  ],
});

export default mongoose.model("guild", guildBotSchema);
