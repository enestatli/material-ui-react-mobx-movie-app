import React, { useState, useEffect, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";

import CardComponent from "../components/Card";
import { MovieFilter } from "../models/movie.models";
import { observer } from "mobx-react";
import MoviesStoreContext from "../stores/MovieStore";
import { likedMoviesKey } from "../models/config";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
});

const page = observer((props) => {
  const { classes } = props;
  const { movies, getMovies, toggleLike, checkLiked } = useContext(
    MoviesStoreContext
  );

  const [likedMovies, setLikedMovies] = useState([]);
  const [filter, setFilter] = useState(null);

  const setLikedMoviesFromStorage = () => {
    const moviesJson = localStorage.getItem(likedMoviesKey);
    if (moviesJson) {
      const _moviesArr = JSON.parse(moviesJson);
      if (_moviesArr) {
        setLikedMovies(_moviesArr);
      }
    }
  };

  const onSubmit = (searchTitle) => {
    if (searchTitle && searchTitle.trim().length > 3) {
      const filter = new MovieFilter(searchTitle);
      setFilter(filter);
    }
  };

  useEffect(() => {
    if (filter) {
      getMovies(filter);
    }
  }, [filter]);

  useEffect(() => {
    setLikedMoviesFromStorage();
  }, []);

  return (
    <div>
      <div className={classes.root} color="inherit">
        <AppBar position="static">
          <Toolbar>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
                noWrap
              >
                movieApp
              </Typography>
            </Link>

            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                placeholder="Search in Favorites"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onKeyDown={(e) => e.keyCode === 13 && onSubmit(e.target.value)}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Grid container spacing={3} style={{ padding: 3, marginTop: 10 }}>
        {filter != null
          ? movies.forEach((movie) => {
              const ids = likedMovies.map((lm) => lm.id);
              if (ids.includes(movie.id)) {
                return (
                  <Grid item xs={12} sm={6} lg={4} xl={3} key={movie.id}>
                    <CardComponent
                      movie={movie}
                      onClickLike={toggleLike}
                      checkLiked={checkLiked}
                    />
                  </Grid>
                );
              }
            })
          : likedMovies.map((movie) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={movie.id}>
                <CardComponent
                  movie={movie}
                  onClickLike={toggleLike}
                  checkLiked={checkLiked}
                />
              </Grid>
            ))}
      </Grid>
    </div>
  );
});

export default withStyles(styles)(page);
