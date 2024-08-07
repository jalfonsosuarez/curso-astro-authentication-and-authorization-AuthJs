import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageUpload {
  static async upload(file: File) {
    const buffer = await file.arrayBuffer();
    const base64image = Buffer.from(buffer).toString("base64");
    const imageType = file.type.split("/")[1];

    const resp = await cloudinary.uploader.upload(
      `data:image/${imageType};base64,${base64image}`
    );

    return resp.secure_url;
  }

  static async delete(image: string) {
    const imageName = image.split("/").pop() ?? "";
    const imageId = imageName.split(".")[0];

    try {
      const resp = await cloudinary.uploader.destroy(imageId);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
