import { FormEvent } from "react";

const MY_URL = "https://api.cloudinary.com/v1_1/demo/auto/upload";
const API_KEY = "416638315783794";


export const uploadWithCloudinary = async (songFile: File) => {
   if (typeof songFile === "undefined") return;

   const formData = new FormData();
   formData.append("file", songFile);
   formData.append("api_key", API_KEY);
   formData.append("upload_preset", "test-upload-preset");
   
   try {
      const result = await fetch(MY_URL, { method: "POST", body: formData });
      console.log("check result", result);
   } catch (error) {
      console.log({ message: error });
   }
};