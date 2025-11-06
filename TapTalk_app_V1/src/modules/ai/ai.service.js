import { AIConversationModel } from "../../model/AIConversation.model.js";
import * as DBservice from "../../DB/DB.service.js";
import { asyncHandler, successResponse } from "../../utils/response.js";

export const getChatHistory = asyncHandler(async (req, res, next) => {
    const conversation = await DBservice.findOne({
        model: AIConversationModel,
        filter: { userId: req.user._id }
    });
    
    const history = conversation?.history || [];
    
    return successResponse({
        res,
        data: { history },
        message: history.length > 0 ? "History found successfully" : "No history yet",
        statusCode: 200,
    });
});


export const deleteChatHistory = asyncHandler(async (req, res, next) => {
    const conversation = await DBservice.findOneAndUpdate({
        model: AIConversationModel,
        filter: { userId: req.user._id },
        data: { history: [] },
        options: { new: true }
    });
    return successResponse({
        res,
        data: { history: conversation.history },
        message: "History deleted successfully",
        statusCode: 200,
    });
});