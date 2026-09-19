import cloudinary from "../config/cloudinary";

export const extractPublicId = (imageUrl: string): string | null => {
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex !== -1) {
      // Get everything after the version number
      const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
      // Remove the file extension and decode URI components (e.g. %20 -> space)
      const publicId = decodeURIComponent(
        publicIdWithExt.split(".").slice(0, -1).join("."),
      );
      return publicId;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  const publicId = extractPublicId(imageUrl);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(
        `Failed to delete image from Cloudinary: ${publicId}`,
        error,
      );
    }
  }
};
