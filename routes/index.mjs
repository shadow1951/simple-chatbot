import { Router } from "express";
import { message } from "../controller/startMessage.mjs";
import { chat, start } from "../controller/indexController.mjs";
const router = Router();

router.post("/chat", chat);
router.get("/chat", start);
export default router;
