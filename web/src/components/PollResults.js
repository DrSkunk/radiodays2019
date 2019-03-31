import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';

const styles = theme => ({
  root: {
    height: '60vh',
    width: '100vw'
  }
});

class PollResults extends Component {
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
    });
  }

  render() {
    const { classes, theme, poll, pollId } = this.props;
    const { pollAnswers } = this.state;
    if (!pollAnswers) {
      console.log('pollAnswers is null');
      return null;
    }
    let totalVotes = 0;
    const votesData = poll.choices.map((choice, index) => {
      const votes = pollAnswers[pollId].votes[index];
      totalVotes += votes;
      return { name: choice.text, votes };
    });

    return (
      <div className={classes.root}>
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
        <Typography variant="title" gutterBottom className={classes.title}>
          {poll.name}
        </Typography>
        <Typography variant="subheading" gutterBottom className={classes.title}>
          {totalVotes} total votes
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PollResults);
