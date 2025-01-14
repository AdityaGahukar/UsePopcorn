import { useEffect } from "react";

export function useKey(key, action){
    useEffect(() => {
    function callback (e){
      if(e.code.toLowerCase() === key.toLowerCase()){
        action();
      }
    }

    document.addEventListener("keydown", callback);

    // cleanup --> a lot of addEventListener function calls might create a memory problem in large apps
    return function(){
      document.removeEventListener("keydown", callback);
    }

  }, [action, key]);
}