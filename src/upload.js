import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload"); // 🔥 nhớ đúng preset

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dp0ub5j02/image/upload",
    formData
  );

  return res.data.secure_url; // 🔥 QUAN TRỌNG
};