import api from './API'; // ✅ نستخدم النسخة المجهزة بالتوكن لأن كل عمليات الرسائل تتطلب تسجيل الدخول

/**
 * @description يجلب قائمة ملخصة بالمحادثات للمستخدم الحالي
 */
const getConversations = async () => {

    const { data } = await api.get('/message/conversations');
    

    return data; 
};



/**
 * @description يحذف المحادثة بين المستخدم الحالي ومستخدم آخر محدد
 * @param {string} otherUserId - الـ ID الخاص بالمستخدم الآخر
 */
const deleteConversation = async (otherUserId) => {

  const {data} =  await api.delete(`/message/conversations/${otherUserId}`);
  console.log(data);
  
  return data ;
};

/**
 * @description يجلب كل الرسائل بين المستخدم الحالي ومستخدم آخر محدد
 * @param {string} otherUserId - الـ ID الخاص بالمستخدم الآخر
 */
const getMessagesWithUser = async (otherUserId) => {

    const { data: responseData } = await api.get(`/message/chat/${otherUserId}`);
    console.log('getMessagesWithUser',responseData);
    console.log('getMessagesWithUser',responseData.data.messages);



    if (responseData && responseData.data && Array.isArray(responseData.data.messages)) {
        return responseData.data.messages; // أرجع المصفوفة نفسها
    } else {
        console.error("Unexpected messages response structure from service:", responseData);
        return []; // أرجع مصفوفة فارغة في حالة الخطأ أو هيكل غير متوقع
    }
};

/**
 * @description يرسل رسالة جديدة لمستخدم آخر
 * @param {string} receiverId - الـ ID الخاص بالمستلم
 * @param {object | FormData} messageData - بيانات الرسالة (قد تكون object {content: '...'} أو FormData إذا احتوت على ملفات)
 */
const sendMessage = async (receiverId, messageData) => {

    const config = {};

    if (messageData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    
    const { data } = await api.post(`/message/${receiverId}/senderId`, messageData, config);
    return data.data.massage; // نرجع بيانات الرسالة المُرسلة
};

/**
 * @description يحذف رسالة معينة (إذا كان المستخدم هو المرسل أو المستقبل)
 * @param {string} messageId - الـ ID الخاص بالرسالة المراد حذفها
 */
const deleteMessage = async (messageId) => {

    const { data } = await api.delete(`/message/${messageId}`);
    return data;
};



const messageService = {
    getConversations,
    getMessagesWithUser,
    sendMessage,
    deleteMessage, // أضفنا دالة الحذف أيضًا
    deleteConversation
};

export default messageService;