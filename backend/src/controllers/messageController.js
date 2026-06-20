import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, conversationId } = req.body; // id của người nhận, nôi dung tin nhắn và id của cuộc trò chuyện
       const senderId = req.user._id; // người gửi

       let conversation;
        if(!content){
            return res.status(400).json({ message: "Nội dung tin nhắn không được để trống" });
        }
        if(conversationId){
            conversation = await Conversation.findById(conversationId);
        }
         if(!conversation){
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() },
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            });
            }
            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content,
            })

            updateConversationAfterCreateMessage(conversation, message, senderId);
            await conversation.save();
            res.status(201).json({ message: "Tin nhắn đã được gửi thành công", data: message });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi tin nhắn trực tiếp" });
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const { content, conversationId } = req.body;
        // Add logic to send group message
    } catch (error) {
        
    }
}