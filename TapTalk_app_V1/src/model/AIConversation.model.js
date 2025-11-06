import mongoose, { Schema } from "mongoose";

const aiConversationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true 
    },
    history: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true
            },
            parts: [{
                text: { type: String }
            }]
        }
    ]
}, { timestamps: true });

export const AIConversationModel = mongoose.model("AIConversation", aiConversationSchema);