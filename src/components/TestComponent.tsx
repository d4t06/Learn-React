import { FC, useEffect, useRef, useState } from "react";

const TestUsememo: FC = () => {
   const [string, setString] = useState<string>("");
   const stringArr = useRef<string[]>([]);

   useEffect(() => {
      console.log("useffect run");

      return () => {
         stringArr.current = string.split(' ');
      };
   }, [string]);

   console.log("string", string);
   
   return (
      <>
      <button onClick={() => setString(string + ' new string')}>add string</button>
         {stringArr.current.map((string) => (
            <p>{string}</p>
         ))}
      </>
   );
};

export default TestUsememo;
