import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "task-management",
    });
    fs.unlinkSync(localFilePath);
    return response?.url;
  } catch (error) {
    //remove the locally saved temp file as the up[load operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteAssetOnCloudinary = async (publicId, type = "image") => {
  try {
    if (!publicId) {
      return null;
    }
    //delete file from cloudinary
    await cloudinary.api.delete_resources([publicId], {
      type: "upload",
      resource_type: type,
    });
  } catch (error) {
    return null;
  }
};

const getCloudinrayPublicId = (url) => {
  return url.split("/").at(-1).split(".")[0];
};

export { uploadOnCloudinary, deleteAssetOnCloudinary, getCloudinrayPublicId };
