import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);
