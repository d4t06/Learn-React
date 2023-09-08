import { useCallback, useEffect, useRef, useState } from "react";

const song_paths = [
   "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FPlay?alt=media&token=d4e55bfa-b5ca-45ec-91be-0fb1ffca06e2",
   "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FPerfect?alt=media&token=73c6263c-6d55-452c-9af3-68226c030d5d",
   "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FLevels%20%20(Radio%20Edit)?alt=media&token=48b8391e-156a-4314-9291-2e41ca5e1be9",
];
function App() {
   const audioRef = useRef<HTMLAudioElement>(null);
   const [duration, setDuration] = useState(0);
   const durationRef = useRef(0);

   // const songLoaded = new Promise(rs => )
   // const [url, setUrl] = useState(song_paths[0]);

   const uploadSong =() => {
      // console.log("uploadSong duration =", duration / 60 );
      const audioEle = audioRef.current as HTMLAudioElement;
      if (audioEle.readyState === 0) {
         // uploadSong()
         return; 
      };
      
      

      console.log("state", audioEle.readyState)

      // console.log("uploadSong durationRef =", durationRef.current /60, 'ready',  );
      // if (duration) {
         // setDuration(0)
      // }
   }

   const changeUrl = () => {
      const audioEle = audioRef.current as HTMLAudioElement;

      let newUrl = audioEle.src;
      while (newUrl === audioEle.src) {
         let index = Math.round(Math.random() * (song_paths.length - 1));
         newUrl = song_paths[index];
      }
      audioEle.src = newUrl;

      uploadSong()
   };

   useEffect(() => {
      const audioEle = audioRef.current as HTMLAudioElement;
      const handleLoad = () => {
         if (audioEle.src) {
            console.log("loadedmetadata");
            // setDuration(audioEle.duration);
            durationRef.current = audioEle.duration
            // uploadSong();
         }
      }
      audioEle.addEventListener("loadedmetadata", handleLoad);
      // return () => audioEle.removeEventListener("loadedmetadata", handleLoad)

   }, []);

   // console.log("check duration", duration);
   

   return (
      <>
         <button onClick={changeUrl}>change url</button>
         <audio  ref={audioRef} controls />
      </>
   );
}

export default App;
