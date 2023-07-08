import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    "647247ad16cf779817fc",
    ID.unique(),
    file
  );

  return fileUploaded;
};

export default uploadImage;