import api from "./API.js";


const getUserProfile = async () => {
    const { data } = await api.get("/user/profile");
    return data;
};

const updateProfile = async (profileData) => {
    const { data } = await api.patch("/user/update-profile", profileData);
    return data;
};


const updatePassword = async (passwordData) => {
    const { data } = await api.patch("/user/update-Password", passwordData);
    return data;
};


const logout = async () => {
    const { data } = await api.post("/user/logout", { flag:"logout" });
    return data;
};


const getFriends = async () => {
    const { data } = await api.get("/user/all_friends");
    return data;
};


const addFriend = async (friendEmail) => {
    const { data } = await api.post("/user/add_friend", { friendEmail });
    return data;
};


const removeFriend = async (friendId) => {
    const { data } = await api.post(`/user/remove_friend/${friendId}`);
    return data;
};


const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.patch("/user/upload-profile-picture-cloud", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


const uploadCoverPicture = (imageFiles) => {
    const formData = new FormData();

    if (Array.isArray(imageFiles)) {
        imageFiles.forEach(file => {
            formData.append("images", file);
        });
    } else {
        formData.append("images", imageFiles);
    }
    return api.post("/user/upload-cover-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getSharedProfile = async (userId) => {
    const response = await api.get(`/user/profile/${userId}`); // ✅ تأكد من الـ endpoint
    console.log(userId);
    console.log("respose",response);
    console.log("data", response.data.data.user);
    
    
    return response.data.data.user; // ✅ تأكد من الـ response structure
};


const freezeAccount = async (userId = null) => {
    const endpoint = "/user/freeze-account";
    const { data } = await api.delete(endpoint);
    return data;
};


const restoreAccount = async (userId = null) => {
    const endpoint = "/user/restore-account";
    const { data } = await api.patch(endpoint);
    return data;
};

const deleteAccount = async (userId = null) => {
    const endpoint = `/user/${userId}`;
    const { data } = await api.delete(endpoint);
    return data;
};

const userService = {
    getUserProfile,
    updateProfile,
    updatePassword,
    logout,
    getFriends,
    addFriend,
    removeFriend,
    uploadProfilePicture,
    uploadCoverPicture,
    getSharedProfile,
    freezeAccount,
    restoreAccount,
    deleteAccount,
};

export default userService;