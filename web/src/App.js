import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        <MediaPlayer currentStation="RadioAct" />
        <PollButtons currentStation="RadioAct" />
        <ToastContainer />
      </div>
    );
  }
}

export default withStyles(styles)(App);
