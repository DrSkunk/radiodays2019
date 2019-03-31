import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import firebase from '../firebase';
import { Button } from '@material-ui/core';

const styles = theme => ({
  root: { height: '100vh' },
  title: {
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around'
  }
});

class PollDetail extends Component {
  state = {};

  componentWillMount() {
    const { currentStation, poll } = this.props;
    console.log('props', this.props);
    console.log('poll', poll);
    this.firebaseRef = firebase
      .database()
      .ref('/')
      .child(currentStation)
      .child('poll_answers');
    this.firebaseCallback = this.firebaseRef.on('value', snap => {
      let val = snap.val();
      if (val === null) {
        val = {};
      }
      console.log('poll_answers', val);
      this.setState({ pollAnswers: val });

      //   const activePoll = val.active_poll;
      //   const displayResults = val.display_results;
      //   const polls = Object.assign({}, val);
      //   delete polls.active_poll;
      //   delete polls.display_results;
      //   this.setState({ polls, activePoll, displayResults });
    });
  }

  activatePoll = () => {
    const { currentStation, pollId } = this.props;
    const body = { station: currentStation, pollId };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch(
      'https://us-central1-test-rhe.cloudfunctions.net/poll?action=activate',
      fetchOptions
    );
  };

  deactivatePoll = () => {
    const { currentStation } = this.props;
    const body = { station: currentStation };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch(
      'https://us-central1-test-rhe.cloudfunctions.net/poll?action=deactivate',
      fetchOptions
    );
  };

  displayResults = () => {
    const { currentStation } = this.props;
    const body = { station: currentStation };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch(
      'https://us-central1-test-rhe.cloudfunctions.net/poll?action=displayResults',
      fetchOptions
    );
  };

  hideResults = () => {
    const { currentStation } = this.props;
    const body = { station: currentStation };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch(
      'https://us-central1-test-rhe.cloudfunctions.net/poll?action=hideResults',
      fetchOptions
    )
      .then(console.log)
      .catch(console.error);
  };

  render() {
    const { classes, theme, poll, pollId, activePollId } = this.props;
    const { pollAnswers } = this.state;
    console.log('poll', poll);
    if (poll === null) {
      return <div>Please select a poll</div>;
    }
    const choices = poll.choices.map((choice, index) => {
      console.log(choice);
      return (
        <div key={'choice' + choice + index}>
          {choice.text} - {pollAnswers[pollId].votes[index]} votes
          <img src={choice.image} alt="" className={classes.art} />
        </div>
      );
    });

    const votesData = poll.choices.map((choice, index) => {
      return { name: choice.text, votes: pollAnswers[pollId].votes[index] };
    });

    return (
      <div className={classes.root}>
        {/* {choices} */}
        {/* PollDetail<pre>{JSON.stringify(pollAnswers[pollId], null, 2)}</pre> */}
        <Typography variant="title" gutterBottom className={classes.title}>
          {poll.name}
        </Typography>
        <ResponsiveContainer height="90%" width="100%">
          <BarChart
            data={votesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="votes" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
        <div className={classes.actions}>
          {/* <pre>{JSON.stringify(activePollId)}</pre> */}
          <Button
            variant="contained"
            color="primary"
            onClick={this.activatePoll}
          >
            Activate this Poll
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.deactivatePoll}
          >
            Deactivate Poll
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.displayResults}
          >
            Display results
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.hideResults}
          >
            Hide results
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PollDetail);
