import api from "./API.js";

const getChatHistory = async () => {
    const { data } = await api.get("/ai/chats/history");
    return data.data.history;
};
const deleteChatHistory = async () => {
    const { data } = await api.delete("/ai/chats/history");
    return data;
};

const aiService = {
    getChatHistory,
    deleteChatHistory
};

export default aiService;