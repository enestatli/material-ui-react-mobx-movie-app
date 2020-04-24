import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Share from "@material-ui/icons/ShareOutlined";
import PlayArrow from "@material-ui/icons/PlayArrowOutlined";
import Info from "@material-ui/icons/InfoOutlined";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import { MovieDetailViewModel } from "../models/movie.models";
import _ from "lodash";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const component = (props) => {
  const [opened, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const ResponsiveDialog = withMobileDialog({ breakpoint: "xs" })(Dialog);
  const { movie, onClickLike, checkLiked } = props;
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const _liked = checkLiked(movie);
    if (_liked !== liked) {
      setLiked(_liked);
    }
  }, []);

  const getInfo = (callback) => {
    fetch(`http://www.omdbapi.com/?apikey=3d05454a&i=${movie.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newInfo = new MovieDetailViewModel(data);
        if (!_.isEqual(newInfo, info)) {
          setInfo(newInfo);
          setTimeout(() => {
            callback();
          }, 200);
        }
      });
  };

  const showInfo = () => {
    if (info) {
      setOpen(true);
    } else {
      getInfo(() => {
        setOpen(true);
      });
    }
  };

  const styles = {
    root: {
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gridGap: "8px",
      boxShadow: "10px 10px 34px -6px rgba(0,0,0,0.75)",
    },

    card: {
      backgroundColor: "whitesmoke" /*firebrick, crimson, indianred */,
      display: "grid",
      gridTemplateRows: "1fr auto",
      gridGap: "4px",
      minHeight: 550,
      backgroundImage: `url(${movie.poster})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    body: {
      alignSelf: "center",
      textAlign: "center",
    },

    actions: {
      backgroundColor: "whitesmoke",
      display: "flex",
      justifyContent: "space-between",
      textDecoration: "none",
      color: "black",
      borderTop: "1px solid #D1D0CE",
    },
  };

  return (
    <div style={{ ...styles.root, position: "relative" }}>
      <Button
        onClick={() => {
          onClickLike(movie, (result) => {
            if (result !== liked) {
              setLiked(result);
            }
          });
        }}
        style={{ position: "absolute", zIndex: 1, top: 10, right: 0 }}
        color="inherit"
        size="large"
      >
        {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
      </Button>
      <Paper style={styles.card}>
        <div style={styles.body}></div>
        <div className="buttons">
          <Button
            color="inherit"
            size="small"
            href={`https://720p-izle.com/izle/altyazi/${movie.title
              .split(" ")
              .join("-")
              .toLowerCase()}.html`}
            target="_blank"
          >
            <PlayArrow />
          </Button>
          <Button color="inherit" size="large" onClick={showInfo}>
            <Info />
          </Button>
          {info && (
            <ResponsiveDialog open={opened} onClose={() => setOpen(false)}>
              <DialogTitle>{info.title} </DialogTitle>

              <DialogContent>
                <DialogContentText>
                  <Typography>{info.plot}</Typography>
                  <Box component="div" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      IMDB Rating {info.rating}
                    </Typography>
                    <Rating
                      max={10}
                      precision={0.1}
                      name="read-only"
                      value={info.rating}
                      readOnly
                    />
                    <Typography>{info.year}</Typography>
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpen(false)}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </DialogActions>
            </ResponsiveDialog>
          )}

          <Button color="inherit" size="large">
            <Share />
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default component;
