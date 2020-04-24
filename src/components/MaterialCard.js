import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";

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

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
  media: {
    height: 600,
  },
});

export default function MediaCard(props) {
  const ResponsiveDialog = withMobileDialog({ breakpoint: "xs" })(Dialog);
  const [opened, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
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
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={movie.poster}
          title={movie.title}
        />
        <CardContent>
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
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button color="inherit" size="large" onClick={showInfo}>
          <Info />
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
