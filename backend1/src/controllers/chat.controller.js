import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Chat } from "../models/chat.models.js";
import { askClaude } from "../utils/ai.services.js";
import mongoose from "mongoose";
import { PDF } from "../models/pdf.models.js";

let SYSTEM_PROMPT = `You are an expert study assistant for students. You can:
- Explain concepts clearly
- Generate quiz questions with answers
- Help revise topics
- Solve problems step by step
- Summarize topics
When generating a quiz, format it as numbered questions with options A B C D and mark the correct answer at the end.`;

// Send a message and get AI reply
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, message, pdfId } = req.body;
  const userId = req.user._id;

  if (!message) throw new ApiError(400, "Message is required");

  if (pdfId) {
  const pdf = await PDF.findById(pdfId);
  if (pdf) {
    SYSTEM_PROMPT += `\n\nThe user has uploaded a document titled "${pdf.title}". Here is its content:\n\n${pdf.text}`;
  }
}

  let chat;

  // Load existing chat or create new one
  if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
    chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) throw new ApiError(404, "Chat not found");
  } else {
    chat = await Chat.create({
      user: userId,
      title: message.slice(0, 40),  // first message becomes title
      messages: [],
    });
  }

  // Add user message
  chat.messages.push({ role: "user", content: message });

  // Build messages array for Claude (last 20 messages for context)
  const history = chat.messages.slice(-20).map(m => ({
    role: m.role,
    content: m.content,
  }));

  // Get Claude's reply
  const reply = await askClaude(history, SYSTEM_PROMPT);

  // Save assistant reply
  chat.messages.push({ role: "assistant", content: reply });
  await chat.save();

  return res.status(200).json(new ApiResponse(200, {
    chatId: chat._id,
    reply,
  }, "Message sent"));
});

// Get all chats for the user (sidebar list)
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id })
    .select("title createdAt")
    .sort({ updatedAt: -1 });

  return res.status(200).json(new ApiResponse(200, chats, "Chats fetched"));
});

// Get a single chat with full message history
const getChatById = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    user: req.user._id,
  });

  if (!chat) throw new ApiError(404, "Chat not found");

  return res.status(200).json(new ApiResponse(200, chat, "Chat fetched"));
});

// Delete a chat
const deleteChat = asyncHandler(async (req, res) => {
  await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user._id });
  return res.status(200).json(new ApiResponse(200, {}, "Chat deleted"));
});

export { sendMessage, getAllChats, getChatById, deleteChat };