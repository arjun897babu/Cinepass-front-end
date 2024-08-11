import axios from "axios";

export const uploadImages = async (image: File) => {
  try {

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'CinepassTheaters');


    const response = await axios.post(`https://api.cloudinary.com/v1_1/dqakjy0hk/image/upload`, formData);


    return response.data.secure_url;
  } catch (error) {

    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};
