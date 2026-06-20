import express from "express";
import { sendFriendRequest,acceptFriendRequest, declineFriendRequest, getAllFriends, getFriendRequests } from "../controllers/friendController.js";

const router = express.Router();
router.post("/request", sendFriendRequest);

router.post("/request/:id/accept", acceptFriendRequest);
router.post("/request/:id/decline", declineFriendRequest);

router.get("/", getAllFriends);
router.get("/requests", getFriendRequests);

export default router;