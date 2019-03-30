import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MediaPlayer from './components/MediaPlayer';
import PollButtons from './components/PollButtons';

const styles = theme => ({
  root: {
    textAlign: 'center'
  },
  albumArt: {
    width: '10vw',
    height: '10vw'
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <MediaPlayer currentRadio="RadioAct" />
        <PollButtons currentRadio="RadioAct" />
      </div>
    );
  }
}

export default withStyles(styles)(App);
