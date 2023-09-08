// import { useEffect, useState } from "react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
// import TestUsememo from "./components/TestComponent";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, store } from "../config/firebase";
import { Song } from "../types";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { handleImage } from "../util/imageParser";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import TestUsememo from "../components/TestComponent";

export default function Upload () {
   const [inputFiels, setInputFields] = useState<Song>({
      name: "",
      singer: "",
      image_path: "",
      song_path: "",
      by: "",
      duration: 0,
      lyric: "",
   });
   const [songFile, setSongFile] = useState<File>();
   const [imageFile, setImageFile] = useState<File>();

   const [songURL, setSongURL] = useState<string>("");
   const [songs, setSongs] = useState<Song[]>();
   const [isUpload, setIsUpload] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const songsColectionRef = collection(db, "songs");

   const handleInput = (
      field: keyof typeof inputFiels,
      value: string | number
   ) => {
      setInputFields({ ...inputFiels, [field]: value });
   };

   //
   const hanleSetSongFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement & { files: FileList };
      const file = target.files[0];

      const songData = await handleImage(file);
      console.log("check songData", songData);

      if (!songData) return;

      setSongFile(file);
      setSongURL(URL.createObjectURL(file));
      setInputFields({
         ...inputFiels,
         name: songData.name,
         singer: songData.singer,
         lyric: songData.lyric,
      });
   };

   const handleSetImageFile = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement & { files: FileList };
      const file = target.files[0];
      setImageFile(file);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsUpload(true);

      if (typeof songFile === "undefined") return;
      const songRef = ref(store, `/songs/${inputFiels.name}`);

      try {
         const songProcess = uploadBytes(songRef, songFile);
         let imageRes, imageProcess, imageUrl;

         if (typeof imageFile != "undefined") {
            const imageRef = ref(store, `/images/${imageFile.name}`);
            imageProcess = uploadBytes(imageRef, imageFile);
         }

         const songRes = await songProcess;
         const songUrl = await getDownloadURL(songRes.ref);

         if (imageProcess) {
            imageRes = await imageProcess;
            imageUrl = await getDownloadURL(imageRes.ref);
         }

         const data: Song = {
            ...inputFiels,
            by: "admin",
            image_path: imageUrl ? imageUrl : inputFiels.image_path,
            song_path: songUrl,
         };

         console.log("check data", data);
         await addToDB(data);
      } catch (error) {
         console.log({ message: error });
      }
   };

   const addToDB = async (data: Song) => {
      try {
         const res = await addDoc(songsColectionRef, data);

         if (typeof res != "undefined") {
            alert("added to db");
            setIsUpload(false);
         }
      } catch (error) {
         console.log({ message: error });
      }
   };

   useEffect(() => {
      const getSongs = async () => {
         try {
            const res = await getDocs(songsColectionRef);

            if (res) {
               const songs = res.docs?.map((doc) => doc.data() as Song);
               setSongs(songs);
            }
         } catch (error) {
            console.log({ message: error });
         }
      };
      getSongs();
   }, []);

   useEffect(() => {
      const handleLoaded = () => {
         setInputFields({
            ...inputFiels,
            duration: +audioEle.duration.toFixed(1),
         });
      };
      const audioEle = audioRef.current as HTMLAudioElement;
      if (!audioEle) return;
      audioEle.addEventListener("loadedmetadata", handleLoaded);

      return () => URL.revokeObjectURL(songURL);
   }, [songURL]);

   const style = {
      form: "flex p-[20px] text-white flex justify-center",
      formGroup: "flex flex-col gap-[10px]",
      input: "px-[10px] py-[5px] rounded-[8px] bg-[#f1f1f1] text-black ",
      button:
         "bg-slate-400 rounded-[8px] h-[35px] flex justify-center items-center",
      left: "flex flex-col gap-[20px]",
   };

   return (
      <div className="min-h-screen  bg-slate-800 text-white">
         <form
            action=""
            onSubmit={(e) => handleSubmit(e)}
            className={style.form + " items-stretch"}
         >
            <div className={style.left}>
               <div className={style.formGroup}>
                  <label htmlFor="">Song file:</label>
                  <input onChange={(e) => hanleSetSongFile(e)} type="file" />
                  <audio ref={audioRef} src={songURL} controls />
                  <h2 className="text-md">
                     Duration: {inputFiels.duration || "00:00"}
                  </h2>
               </div>
               <div className={style.formGroup}>
                  <label htmlFor="">Name</label>
                  <input
                     type="text"
                     className={style.input}
                     onChange={(e) => handleInput("name", e.target.value)}
                     value={inputFiels.name}
                  />
               </div>
               <div className={style.formGroup}>
                  <label htmlFor="">Singer</label>
                  <input
                     type="text"
                     className={style.input}
                     onChange={(e) => handleInput("singer", e.target.value)}
                     value={inputFiels.singer}
                  />
               </div>
               <div className={style.formGroup}>
                  <label htmlFor="">Image</label>
                  <input
                     placeholder="URL..."
                     type="text"
                     className={style.input}
                     value={inputFiels.image_path}
                     disabled={typeof imageFile != "undefined"}
                     onChange={(e) => handleInput("image_path", e.target.value)}
                  />
                  <input
                     disabled={!!inputFiels.image_path}
                     type="file"
                     onChange={(e) => handleSetImageFile(e)}
                  />
               </div>

               <button
                  disabled={isUpload}
                  className={style.button + ` ${isUpload ? "opacity-40" : ""}`}
                  type="submit"
               >
                  <span>
                     {isUpload ? (
                        <ArrowPathIcon className="h-[25px] w-[25px] animate-spin" />
                     ) : (
                        "Add"
                     )}
                  </span>
               </button>
            </div>
            <div className="ml-[20px]">
               <div className={style.formGroup + " h-full"}>
                  <label htmlFor="">Lyric</label>
                  <textarea
                     className={style.input + " h-full bg-opacity-50"}
                     onChange={(e) => handleInput("lyric", e.target.value)}
                     value={inputFiels.lyric}
                  />
               </div>
            </div>
         </form>

         <TestUsememo />
      </div>
   );
}