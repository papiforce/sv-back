import mongoose, { Schema, Document } from "mongoose";

export interface IWaitlist extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string): boolean {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Format d'email invalide",
      },
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WaitlistSchema.index({ createdAt: -1 });

export default mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);
