import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  status: "active" | "completed";
  user: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
