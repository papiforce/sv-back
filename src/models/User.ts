import { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

import { UserRoleType, RefreshTokenType } from "../types";

export interface IUser extends Document {
  description?: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  password?: string;
  roles: UserRoleType[];
  profilePicture?: string;
  discordId?: string;
  discordUsername?: string;
  discordDiscriminator?: string;
  authProvider: "LOCAL" | "DISCORD";
  refreshTokens: RefreshTokenType[];
  referalCode?: string;
  isDeleted: boolean;
  updatedBy?: Schema.Types.ObjectId;
  deletedBy?: Schema.Types.ObjectId;
  sponsoredBy?: Schema.Types.ObjectId;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      select: false,
    },
    roles: {
      type: [String],
      required: true,
      enum: ["MEMBER", "MODERATOR", "ADMIN", "FOUNDER"],
      default: ["MEMBER"],
    },
    profilePicture: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    discordId: {
      type: String,
      unique: true,
      required: false,
      default: null,
    },
    discordUsername: {
      type: String,
      unique: true,
      required: false,
      default: null,
    },
    discordDiscriminator: {
      type: String,
      unique: true,
      required: false,
      default: null,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: Date.now },
        deviceInfo: { type: String, required: true },
      },
    ],
    referalCode: {
      type: String,
      required: false,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["LOCAL", "DISCORD"],
      default: "LOCAL",
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
    sponsoredBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (this: IUser, next: (err?: any) => void) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

export default model<IUser>("User", UserSchema);
