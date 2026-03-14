import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  }

},
{ timestamps: true }
);

export const PDF = mongoose.model("PDF", pdfSchema);