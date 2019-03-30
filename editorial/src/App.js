import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Polls from './components/Polls';

const styles = theme => ({
  root: {}
});

class App extends Component {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Polls currentStation="RadioAct" />
      </div>
    );
  }
}

export default withStyles(styles)(App);
