import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import massageController from "./modules/massage/massage.controller.js";
import aiController from "./modules/ai/ai.controller.js";
import connectDB from './DB/connection.js';
import { globalErrorHandler } from './utils/response.js';import path, { resolve } from 'path';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import helmet from "helmet";
import { specs, swaggerUi } from './utils/swagger.js';
import { MassageModel } from "./model/Massage.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai'; // تم استيرادها
import * as DBservice from './DB/DB.service.js';
import { AIConversationModel } from "./model/AIConversation.model.js";
import { error } from "console";

const bootstrap = async () => {
    const app = express();
    const port = process.env.PORT;
    app.use(express.json());

    const vercelUrl="https://tap-talk-app-v2.vercel.app";
    const vercelPreviewUrl = "https://tap-talk-app-v2-git-main-mohamed-shamel1s-projects.vercel.app";
    const allowOrigans = ['http://localhost:5173' , vercelUrl ,vercelPreviewUrl ];

    app.use(cors({
        origin: '*',
         methods: ['GET','POST','PUT','DELETE','OPTIONS'],
        credentials: true
    }));
    app.options('*', cors());
    // app.use(helmet());

    const limiter = rateLimit({
        windowMs: 60 * 60 * 1000,
        limit: 2000,
        message: "Too many requests from this IP, please try again after an hour",
        standardHeaders: 'draft-8',
    });

    // --- تهيئة موديل Gemini ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// app.use("/api/auth", limiter);
    await connectDB();

    app.get('/', (req, res) => {
        res.json("Welcome to the TapTalk APP");
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'TapTalk API Documentation'
    }));
 
    // Routes
    app.use("/api/auth", authController);
    app.use("/api/user", userController);
    app.use("/api/message", massageController);
    app.use("/api/ai", aiController);

    app.all('*', (req, res) => {
        res.status(404).json({ message: "Not Found" });
    });

    app.use(globalErrorHandler);

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
        
        socket.on('joinRoom', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        socket.on('typing', ({ receiverId }) => {
            socket.to(receiverId).emit('typing');
        });
        socket.on('stopTyping', ({ receiverId }) => {
            socket.to(receiverId).emit('stopTyping');
        });

        socket.on('message-readed', async ({ massagesIds, senderId }) => {
            try {
                await DBservice.updateMany({
                    model: MassageModel,
                    filter: { _id: { $in: massagesIds } },
                    data: {
                        $push: { readBy: senderId }, // يُفضل استخدام ID المستخدم الذي قرأ
                        $set: { isRead: true }
                    },
                });
                socket.to(senderId).emit('message-readed', massagesIds);
            } catch (error) {
                console.log(error, "error in message-readed");
            }
        });

        socket.on("aiSendMessage", async ({ message, userId }) => { 
            if (!message || !userId) {
                return socket.emit("aiError", {
                    error: "Please provide message and userId"
                });
            }
            try {
                socket.emit("aiTyping"); 
                console.log("socketAi connected");
                
                const conversation = await DBservice.findOne({
                    model: AIConversationModel,
                    filter: { userId }
                });

              const rawHistory = conversation ? conversation.history : [];

              const chatHistory = rawHistory.map(item => ({
                  role: item.role,
                  parts: item.parts.map(part => ({
                      text: part.text 
                  }))
              }));

                const chat = model.startChat({
                    history: chatHistory
                });

                const result = await chat.sendMessage(message);
                const response = result.response;
                
                const aiReply = response.text(); 

                const newHistory = [
                    ...rawHistory,
                    { role: "user", parts: [{ text: message }] },
                    { role: "model", parts: [{ text: aiReply }] }
                ];

                await DBservice.findOneAndUpdate({
                    model: AIConversationModel,
                    filter: { userId },
                    data: { history: newHistory }, 
                    options: { upsert: true }
                });

                socket.emit("aiTypingStop"); 

                socket.emit("newAiMessage", {
                    reply: aiReply
                });

            } catch (error) {
                console.log("that was an error in ai socket", error);
                socket.emit("aiError", {
                    error: error.message
                });
                socket.emit("aiTypingStop"); // هذا الجزء كان سليمًا
            }
        });
    });

    httpServer.listen(port,'0.0.0.0' , () => {
        console.log(`Server is running on ${port}`);
    });

    httpServer.on('error', (error) => {
        console.error('Server error:', error);
    });
    
    return {
        app,
        httpServer,
        io
    };
};

export default bootstrap;