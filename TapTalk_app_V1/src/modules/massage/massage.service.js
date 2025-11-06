import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from "../../DB/DB.service.js";
import User from "../../model/user.model.js";
import { deleteResourcesCloud, uploadFilesCloud } from "../../utils/multier/cloudinary.js";
import { MassageModel } from "../../model/Massage.model.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId; // الطريقة الصحيحة لتعريف ObjectId



let io; 
export const setIO = (_io) => {
  io = _io; // الدالة التي سيستدعيها الملف الرئيسي لتمرير io
  console.log("Socket.IO instance set in message service."); // رسالة تأكيد
}




export const sendMassage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const { content } = req.body;
  let attachments = [];
  const { files } = req;
  const senderId = req.user._id;

  if (!files?.length && !content) {
    return next(new Error("Message content or files are required", { cause: 400 }));
  }

  const receiverUser = await DBservice.findOne({
      model: User,
      filter: { _id: receiverId, isVerified: true, deletedAt: null },
  });
  if (!receiverUser) {
    return next(new Error("Receiver user not found or not verified", { cause: 404 }));
  }

  if (files?.length) {
    attachments = await uploadFilesCloud({ files: req.files, path: `Messages/${receiverId}` });
  }

  const [massage] = await DBservice.create({
    model: MassageModel,
    data: [{
      content,
      attachments,
      receiverId: new ObjectId(receiverId),
      senderId: senderId
    }]
  });

  if (io) {
      const populatedMessage = await MassageModel.findById(massage._id).populate([
          { path: "senderId", select: "firstName lastName profilePicture" },
          { path: "receiverId", select: "firstName lastName profilePicture" }
      ]);
      

      io.to(receiverId.toString()).emit('newMassage', { massage: populatedMessage });
      

      io.to(senderId.toString()).emit('newMassage', { massage: populatedMessage });
  } else {
      console.warn("Socket.IO instance not available in sendMassage");
  }

  return successResponse({
    res,
    data: { massage },
    message: "Message sent successfully",
    statusCode: 201,
  });
});



export const getMassageById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.user._id;


  const massage = await DBservice.findOneAndUpdate({
    model: MassageModel,
    filter: {
      _id: id,

      $or: [ { senderId: currentUserId }, { receiverId: currentUserId } ]
    },

    data: { $set: { isRead: true } }, // $set يضمن التحديث فقط إذا طابق الفلتر
    options: { new: true } // أرجع النسخة المحدثة
  });

  if (!massage) {
    return next(new Error("Message not found or you don't have access", { cause: 404 }));
  }

  return successResponse({
    res,
    data: { massage },
    message: "Message fetched successfully",
    statusCode: 200,
  });
});




export const getAllMassages = asyncHandler(async (req, res, next) => {


    
    const messages = await DBservice.find({ // تم تغيير الاسم
      model: MassageModel,
      filter: {
        $or: [ { senderId: req.user._id }, { receiverId: req.user._id } ]
      },
      populate: [
        { path: "senderId", select: "firstName lastName fullName" },
        { path: "receiverId", select: "firstName lastName fullName" }
      ],
      sort: { createdAt: -1 }
    });
  
    return successResponse({
      res,
      data: { messages }, // تم تغيير الاسم
      message: "All messages fetched successfully",
      statusCode: 200,
    });
  });




export const deleteMassage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const currentUserId = req.user._id;


    const massage = await DBservice.findOne({
      model: MassageModel,
      filter: { _id: id, $or: [ { senderId: currentUserId }, { receiverId: currentUserId } ] },
    });
    if (!massage) {
      return next(new Error("Message not found or you cannot delete it", { cause: 404 }));
    }

    if(massage.attachments && massage.attachments.length){
      const IDs = massage.attachments.map(attachment => attachment._id).filter(Boolean);
      if(IDs.length > 0){
        await deleteResourcesCloud({ public_ids: IDs });
      }
    }


    await DBservice.deleteOne({
      model: MassageModel,
      filter: { _id: id }, // يكفي الحذف بالـ ID بعد التحقق من الملكية
    });


    if (io) {
        const otherUserId = massage.senderId.equals(currentUserId) ? massage.receiverId : massage.senderId;
        io.to(otherUserId.toString()).emit('messageDeleted', { messageId: id });
        io.to(currentUserId.toString()).emit('messageDeleted', { messageId: id });
    }

    return successResponse({
      res,
      data: { messageId: id }, // أرجع ID الرسالة المحذوفة
      message: "Message deleted successfully",
      statusCode: 200,
    });
  });
  



export const getMassagesWithUsers = asyncHandler(async (req, res, next) => {
    const { otherUserId: otherUserIdString } = req.params;
    const currentUserId = req.user._id; // نفترض أنه ObjectId من الميدلوير

    let otherUserId;
    try {
        otherUserId = new ObjectId(otherUserIdString);
    } catch (castError) {
        return next(new Error("Invalid user ID format in URL", { cause: 400 }));
    }



    const updateResult = await DBservice.updateMany({
        model: MassageModel,
        filter: {
            senderId: otherUserId, // الرسائل المرسلة من الطرف الآخر
            receiverId: currentUserId, // والمستقبلة بواسطتي
            isRead: false // والتي لم تُقرأ بعد
        },
        data: { isRead: true }
    });


    const messages = await DBservice.find({ // تم تغيير الاسم
        model: MassageModel,
        filter: {
            $or: [
                { receiverId: currentUserId, senderId: otherUserId },
                { senderId: currentUserId, receiverId: otherUserId }
            ]
        },
        populate: [
            { path: "senderId", select: "firstName lastName profilePicture" },
            { path: "receiverId", select: "firstName lastName profilePicture" }
        ],
        sort: { createdAt: 1 } // ترتيب تصاعدي لعرض الشات
    });



    if (updateResult.modifiedCount > 0 && io) {

         const updatedMessages = await DBservice.find({
             model: MassageModel,
             filter: {
                 senderId: otherUserId, // رسائل الطرف الآخر
                 receiverId: currentUserId, // التي استقبلتها أنا
                 isRead: true // والتي أصبحت مقروءة (قد تحتاج لفلتر أدق يعتمد على الوقت)
             },
             select: '_id' 
         });
         const updatedMessageIds = updatedMessages.map(msg => msg._id);

        if (updatedMessageIds.length > 0) {

           io.to(otherUserId.toString()).emit('messages_updated_to_read', {
                messageIds: updatedMessageIds,


           });
           console.log(`Emitted messages_updated_to_read for ${updatedMessageIds.length} messages to user ${otherUserId}`);
        }
    }


    return successResponse({
        res,
        data: { messages }, // تم تغيير الاسم
        message: "Messages fetched and marked as read successfully",
        statusCode: 200,
    });
});




export const getConversations = asyncHandler(async (req, res, next) => {
    const currentUserId = new ObjectId(req.user._id);

    const conversations = await MassageModel.aggregate([

        { $match: { $or: [{ senderId: currentUserId }, { receiverId: currentUserId }] } },

        { $sort: { createdAt: -1 } },

        {
            $group: {
                _id: { // تجميع حسب الطرف الآخر
                    $cond: {
                        if: { $eq: ["$senderId", currentUserId] },
                        then: "$receiverId",
                        else: "$senderId"
                    }
                },
                lastMessage: { $first: "$$ROOT" },
                unreadCount: {
                    $sum: {
                        $cond: [
                            { $and: [
                                { $eq: ["$receiverId", currentUserId] },
                                { $eq: ["$isRead", false] }
                            ]},
                            1, 0
                        ]
                    }
                }
            }
        },

        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "withUser" } },

        { $match: { "withUser": { $ne: [] } } },

        { $unwind: "$withUser" },

        {
            $project: {
                _id: 0,
                "withUser._id": 1,
                "withUser.firstName": 1,
                "withUser.lastName": 1,
                "withUser.profilePicture": 1,
                "lastMessage.content": 1,
                "lastMessage.createdAt": 1,
                unreadCount: 1
            }
        }
    ]);



    return successResponse({
        res,
        data: { conversations },
        message: "Conversations fetched successfully",
        statusCode: 200,
    });
});


export const deleteConversation = asyncHandler(async (req, res, next) => {
    const senderId  = req.user._id;
    const {receiverId} =req.params

  
    const deletedMessages = await DBservice.find({
      model: MassageModel,
      filter: {
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    const publicIdsToDelete = [];
    deletedMessages.forEach(msg => {
        if (msg.attachments && msg.attachments.length > 0) {
            msg.attachments.forEach(att => att.public_id && publicIdsToDelete.push(att.public_id));
        }
    });
    if(publicIdsToDelete.length > 0){
      await deleteResourcesCloud({ public_ids: publicIdsToDelete });
    }
  
  const deleteResult = await DBservice.deleteMany({
      model: MassageModel,
      filter: {
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if(io){
      io.to(receiverId.toString()).emit('conversationDeleted', { conversationId: receiverId });
      io.to(senderId.toString()).emit('conversationDeleted', { conversationId: receiverId });
    }
  
    return successResponse({
      res,
      data: { deleteResult },
      message: "Messages deleted successfully",
      statusCode: 200,
    });
})