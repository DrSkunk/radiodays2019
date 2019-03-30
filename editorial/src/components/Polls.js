import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddPoll from '../atoms/AddPoll';
import firebase from '../firebase';
import PollDetail from './PollDetail';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '20vw 80vw'
  },
  title: {
    textAlign: 'center'
  },
  pollList: {
    display: 'flex',
    flexDirection: 'column'
  },
  addPollButton: {
    position: 'absolute',
    bottom: 5,
    left: 5
  }
});

class Polls extends Component {
  state = { polls: {}, selectedPoll: null };

  selectPoll = pollId => {
    console.log(this.state.polls, this.state.polls[pollId]);
    this.setState({
      selectedPoll: this.state.polls[pollId],
      selectedPollId: pollId
    });
  };

  componentWillMount() {
    this.firebaseRef = firebase
      .database()
      .ref('/')
      .child(this.props.currentStation)
      .child('polls');
    this.firebaseCallback = this.firebaseRef.on('value', snap => {
      let val = snap.val();
      if (val === null) {
        val = {};
      }
      console.log('firebase', val);
      const activePoll = val.active_poll;
      const displayResults = val.display_results;
      const polls = Object.assign({}, val);
      delete polls.active_poll;
      delete polls.display_results;

      this.setState({ polls, activePoll, displayResults });
    });
  }
  render() {
    const { classes } = this.props;
    const {
      polls,
      activePoll,
      selectedPoll,
      displayResults,
      selectedPollId
    } = this.state;

    const pollList = Object.keys(polls).map(pollId => {
      const poll = polls[pollId];
      const style = {};
      if (pollId === selectedPoll) {
        style.color = 'red';
      }
      return (
        <Button
          variant="contained"
          style={style}
          key={pollId}
          onClick={() => this.selectPoll(pollId)}
        >
          {poll.name}
        </Button>
      );
    });

    return (
      <div className={classes.root}>
        {/* <pre>{JSON.stringify(polls, null, 2)}</pre> */}
        <div className={classes.pollList}>
          <Typography variant="title" gutterBottom className={classes.title}>
            Polls
          </Typography>
          {pollList}
        </div>

        <PollDetail
          currentStation="RadioAct"
          poll={selectedPoll}
          pollId={selectedPollId}
          activePollId={activePoll}
        />
        <div className={classes.addPollButton}>
          <AddPoll currentStation="RadioAct" />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Polls);
