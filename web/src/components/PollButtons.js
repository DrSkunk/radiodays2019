import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%'
  },
  image: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15
      },
      '& $imageMarked': {
        opacity: 0
      },
      '& $imageTitle': {
        border: '4px solid currentColor'
      }
    }
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity')
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme
      .spacing.unit + 6}px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity')
  }
});

class PollButtons extends Component {
  state = {
    poll: null
  };

  componentWillMount() {
    this.firebaseRef = firebase
      .database()
      .ref('/')
      .child(this.props.currentRadio);
    this.firebaseCallback = this.firebaseRef.on('value', snap => {
      let val = snap.val();
      if (val.polls.active_poll === undefined) {
        this.setState({ poll: null });
        return;
      }
      console.log('val.polls', val.polls);
      const poll = val.polls[val.polls.active_poll];
      this.setState({ poll });
    });
  }
  render() {
    const { classes } = this.props;
    const { poll } = this.state;

    if (poll === null) {
      return null;
    }

    const choices = poll.choices;
    const width = 100 / choices.length + '%';

    return (
      <div className={classes.root}>
        {choices.map(image => (
          <ButtonBase
            focusRipple
            key={image.text}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width
            }}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.image})`
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.text}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        ))}
      </div>
    );
  }
}

PollButtons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PollButtons);