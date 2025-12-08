import { Schema, Document, model } from "mongoose";

export interface IWaitlist extends Document {
  email: string;
  code: string;
  userId: Schema.Types.ObjectId;
}

const WaitlistSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default model<IWaitlist>("Waitlist", WaitlistSchema);
