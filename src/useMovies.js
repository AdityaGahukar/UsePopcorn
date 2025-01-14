// Custom Hook
import { useState, useEffect } from "react";

const KEY = "5fd02eb9";

export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(function () {

        callback?.();
        const controller = new AbortController();  // browser API  --> to control the multiple fetch reqs
    
        async function fetchMovies() {
          try {
            setIsLoading(true);
            setError("");  // reset the error state
    
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});
            if(!res.ok){
              throw new Error("Something went wrong while fetching movies"); // if there is a network issue (offline, server down, CORS issue, etc.)
            }
    
            const data = await res.json();
            if(data.Response === "False"){ 
              throw new Error(data.Error);  // if there is an issue with the API (wrong API key, wrong endpoint, etc.) , wrong query
            }
    
            setMovies(data.Search);
            setError("");
          }
          catch (err) {
            if(err.name !== "AbortError"){
              console.log(err.message);
              setError(err.message);
            }
          }
          finally{
            setIsLoading(false);
          }
        }
    
        if(query.length < 3){
          setMovies([]);
          setError("");
          return;
        }
    
        // handleCloseMovie();  // close the current movie before we fetch the next movie

        fetchMovies();
    
        // new keystroke --> new re-render --> abort the current fetch request
        return function () {
          controller.abort();
        }
      }, [query, callback]);  // Since callback is wrapped in useCallback in App.js, it will only change when its dependencies in App.js change. This minimizes unnecessary effect re-runs.    

      return {movies, isLoading, error};
    }