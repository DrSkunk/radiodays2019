import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddPoll from './atoms/AddPoll';

const styles = theme => ({
  root: {}
});

class App extends Component {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AddPoll currentStation="RadioAct" />
      </div>
    );
  }
}

export default withStyles(styles)(App);
