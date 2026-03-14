import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage, getAllChats, getChatById, deleteChat } from "../controllers/chat.controller.js";

const router = Router();
router.use(verifyJWT); // all routes require login

router.post("/send", sendMessage);
router.get("/", getAllChats);
router.get("/:chatId", getChatById);
router.delete("/:chatId", deleteChat);

export default router;