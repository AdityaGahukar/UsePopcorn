import { useCallback, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "5fd02eb9";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Custom Hook
  const handleCloseMovie = useCallback(() => {  // Memoize handleCloseMovie to avoid unnecessary re-creation
    setSelectedId(null);
  }, []);  // No dependencies, as it doesn't rely on external state

  const {movies, isLoading, error} = useMovies(query, handleCloseMovie);
  
  // const [watched, setWatched] = useState([]);   --> pass a callback function to get localStorage
  // const [watched, setWatched] = useState(function(){
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });
  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleSelectMovie(id) {
    setSelectedId(selectedId => selectedId === id ? null : id);
  }

  // function handleCloseMovie(){
  //   setSelectedId(null);
  // }

  function handleAddWatched(movie){
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(function(){
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched])

  
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        {/* Component Composition without children prop (by passing elements as props) */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box element={<>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>} /> */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (<MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} />) :
            (<> 
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>)
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({message}){
  return <p className="error">
      <span>⛔</span> {message}
    </p>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">
    <Logo />
    {children}
  </nav>
}

function Logo() {
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function(){
    if(document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  
  useKey("NumpadEnter", function(){
    if(document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(function(){
  //   function callback(e){
      
  //     if(e.code === "Enter" || e.code === "NumpadEnter"){
  //       if(document.activeElement === inputEl.current) return;
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }

  //   document.addEventListener("keydown", callback);
  //   inputEl.current.focus();  // focus on the initial render

  //   return () => document.removeEventListener("keydown", callback);
  // }, [setQuery]);

  // useEffect(function(){
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, [])

  return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref = {inputEl}
  />
}

function NumResults({ movies }) {
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
}

function Main({ children }) {

  return <main className="main">
    {children}
  </main>
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && children}
  </div>
}

function MovieList({ movies, onSelectMovie }) {

  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
    ))}
  </ul>
}

function Movie({ movie, onSelectMovie }) {
  return <li onClick={() => onSelectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return <div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (
//       <>
//         <WatchedSummary watched={watched} />

//         <WatchedMoviesList watched={watched} />
//       </>
//     )}
//   </div>
// }

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);
  useEffect(function(){
    if(userRating) countRef.current = countRef.current + 1;
  }, [userRating])

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  // destructure the properties in the data object into variables (also to give our own variable names)
  const {Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre} = movie;

  function handleAdd(){
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating : Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  
  useEffect(function(){
    async function getMovieDetails(){
      setIsLoading(true);
      setUserRating(0);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  // to change to title of the website to the movie name
  useEffect(() => {
    if(!title) return;
    document.title = `Movie | ${title}`;

    // cleanup function
    return function() {
      document.title = "UsePopcorn";  // cleanup effect for the current movie
    }
  }, [title]);

  // click 'esc' to close the movie details tab
  // useEffect(() => {
  //   function callback (e){
  //     if(e.code === "Escape"){
  //       onCloseMovie();
  //     }
  //   }

  //   document.addEventListener("keydown", callback);

  //   // cleanup --> a lot of addEventListner function calls might create a memory problem in large apps
  //   return function(){
  //     document.removeEventListener("keydown", callback);
  //   }

  // }, [onCloseMovie]);
  useKey("Escape", onCloseMovie)

  return (
    <div className="details">
      {isLoading ? <Loader /> : 
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &lArr;
            </button>
            <img src={poster} alt={`Poster of the ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p><span>⭐</span><b>{imdbRating}</b> IMDb Rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                  {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}
                </>
              ) : <p>You rated this movie {watchedUserRating} <span>⭐</span> </p> }
            </div>
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
    ))}
  </ul>
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return <li>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>

      <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
    </div>
  </li>
}