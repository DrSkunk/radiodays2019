import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import radioLogo from '../assets/logo.png';
import firebase from '../firebase';

const styles = theme => ({
  root: {
    // display: 'flex',
    width: '100vw'
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 151,
    right: 0
  },
  controls: {
    // display: 'flex',
    // alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  }
});

class MediaPlayer extends Component {
  state = {
    nowOnAir: {
      artist: 'TBA',
      song: 'TBA',
      album: 'TBA'
    }
  };

  componentWillMount() {
    this.firebaseRef = firebase
      .database()
      .ref('/')
      .child(this.props.currentStation);
    this.firebaseCallback = this.firebaseRef.on('value', snap => {
      let val = snap.val();
      if (val === null) {
        val = {};
      }
      console.log('firebase', val);
      this.setState({ nowOnAir: val.now_on_air });
    });
  }
  render() {
    const { classes, theme } = this.props;
    const { nowOnAir } = this.state;
    let img = radioLogo;
    if (nowOnAir.art) {
      img = nowOnAir.art;
    }

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {nowOnAir.song}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {nowOnAir.artist} - {nowOnAir.album}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <IconButton aria-label="Previous">
                {theme.direction === 'rtl' ? (
                  <SkipNextIcon />
                ) : (
                  <SkipPreviousIcon />
                )}
              </IconButton>
              <IconButton aria-label="Play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label="Next">
                {theme.direction === 'rtl' ? (
                  <SkipPreviousIcon />
                ) : (
                  <SkipNextIcon />
                )}
              </IconButton>
            </div>
          </div>
          <CardMedia
            className={classes.cover}
            image={img}
            title="Live from space album cover"
          />
        </Card>
      </div>
    );
  }
}

MediaPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MediaPlayer);
