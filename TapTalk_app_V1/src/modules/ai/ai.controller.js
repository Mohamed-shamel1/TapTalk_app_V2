import { Router } from "express";
const router = Router();

import * as ai from "./ai.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

router.get(
    "/chats/history",
    authMiddleware,
    ai.getChatHistory
);

router.delete(
    "/chats/history",
    authMiddleware,
    ai.deleteChatHistory
);

export default router;