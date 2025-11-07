import cloudinary from 'cloudinary';
import path from "path";

export const cloud = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary.v2;
};


export const uploadFileCloud = async ({ file = {}, path = "general" } = {}) => {

  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloud().uploader.upload_stream(
        {
          folder: `${process.env.APP_NAME}/${path}`,
          resource_type: "auto", // يدعم صور ومستندات
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ File uploaded:", result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
  

  if (file.path) {
    return await cloud().uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/${path}`,
      resource_type: "auto",
    });
  }


  throw new Error("File must have either buffer or path property");
};


export const uploadFilesCloud = async ({ files = [], path = "general" } = {}) => {
  let attachments = [];
  
  for (const file of files) {
    try {
      const { secure_url, public_id } = await uploadFileCloud({ 
        file: file, 
        path: path 
      });
      attachments.push({ secure_url, public_id });
    } catch (error) {
      console.error(`❌ Failed to upload ${file.originalname}:`, error);
      throw error; // أوقف العملية لو فشل رفع أي ملف
    }
  }
  
  return attachments;
};


export const deleteFileCloud = async ({ public_id = "" } = {}) => {
  return await cloud().uploader.destroy(public_id);
};


export const deleteResourcesCloud = async ({ 
  public_ids = [], 
  options = {
    type: "upload",
    resource_type: "image"
  } 
} = {}) => {
  return await cloud().api.delete_resources(public_ids, options);
};


export const deleteFolderByPrefixCloud = async ({ prefix = "" } = {}) => {
  return await cloud().api.delete_resources_by_prefix(`${process.env.APP_NAME}/${prefix}`);
};