import React from "react";
import { API_URL } from "../models/config";
import { MovieListItemViewModel } from "../models/movie.models";
import { likedMoviesKey } from "../models/config";
import { observable, action } from "mobx";
import qs from "qs";

export const MoviesStore = () => {
  const store = observable({
    isLoading: false,
    isError: false,
    movies: [],
    getMovies: action((filter) => {
      store.isLoading = true;
      const query = qs.stringify(filter);
      const url = API_URL + query;
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong ...");
          }
        })
        .then((data) => {
          store.isLoading = false;
          store.movies.length = 0;
          data.Search.forEach((item) => {
            store.movies.push(new MovieListItemViewModel(item));
          });
        })
        .catch((error) => {
          store.isLoading = false;
          store.isError = true;
          console.log("Error is fetching movies", error);
        });
    }),
    checkLiked: action((movie) => {
      const moviesJson = localStorage.getItem(likedMoviesKey);
      if (moviesJson) {
        const moviesArr = JSON.parse(moviesJson);
        const _movie = moviesArr.find((m) => m.id === movie.id);
        return _movie != null;
      }
    }),
    toggleLike: action((movie, callback) => {
      const moviesJson = localStorage.getItem(likedMoviesKey);
      if (moviesJson) {
        const moviesArr = JSON.parse(moviesJson);
        const _movie = moviesArr.find((m) => m.id === movie.id);
        if (_movie) {
          //movie is liked
          const others = moviesArr.filter((m) => m.id !== _movie.id);
          localStorage.setItem(likedMoviesKey, JSON.stringify(others));
          callback(false);
        } else {
          moviesArr.push(movie);
          localStorage.setItem(likedMoviesKey, JSON.stringify(moviesArr));
          callback(true);
        }
      } else {
        const likes = [movie];
        localStorage.setItem(likedMoviesKey, JSON.stringify(likes));
        callback(true);
      }
    }),
  });
  return store;
};

export default React.createContext();
