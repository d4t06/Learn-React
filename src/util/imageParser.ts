import parse from "id3-parser";
import { convertFileToBuffer } from "id3-parser/lib/util";
import { ParserSong } from "../types";

export const handleImage = async (songFile: File) => {

   if (!songFile) return;
   const tags = await convertFileToBuffer(songFile).then(parse);

   if (!tags) return;
   console.log("check tag", tags);

   const { title, artist, lyrics } = tags
   const data: ParserSong = { name: '', singer: '', lyric: '' }

   if (!title || !artist) return;

   data.name = title;
   data.singer = artist;
   data.lyric = lyrics?.length
      ? lyrics[0].value 
         ? lyrics[0].value 
         : ''
      : ''

   return data;
};
