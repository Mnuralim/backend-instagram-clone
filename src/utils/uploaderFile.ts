import cloudinary from "./cloudinary";

export const uploader = async (path: string, publicId: string) => {
  const result = await cloudinary.uploader.upload(
    path,
    {
      resource_type: "auto",
      folder: "whatsapp-clone",
      public_id: publicId,
    },
    (err, result) => {
      console.log(err);
    }
  );

  return result;
};
