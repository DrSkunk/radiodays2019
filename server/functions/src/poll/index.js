import { https } from 'firebase-functions';
import { firebase as admin, checkAll } from '../util';
const cors = require('cors')({
  origin: true
});

const db = admin.database();

const ref = db.ref('/');

export default https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { action } = req.query;
      const { pollId, station } = req.body;
      checkAll({ station });
      console.log(req.query);
      switch (action) {
        case 'activate':
          checkAll({ pollId });
          await ref
            .child(station)
            .child('polls')
            .update({ active_poll: pollId });
          break;
        case 'deactivate':
          await ref
            .child(station)
            .child('polls')
            .update({ active_poll: '' });
          break;
        case 'displayResults':
          await ref
            .child(station)
            .child('polls')
            .update({ display_results: true });
          break;
        case 'hideResults':
          await ref
            .child(station)
            .child('polls')
            .update({ display_results: false });
          break;
        default:
          throw new Error('Invalid action');
      }

      //   const { station, name, choices } = req.body;
      //   console.log('req.body', req.body);
      //   checkAll({ station, name, choices });
      //   console.log(req.body);
      //   const poll = { name, choices };
      //   const pushedPollKey = (await ref
      //     .child(station)
      //     .child('polls')
      //     .push(poll)).key;

      //   const pollAnswers = { name, votes: Array(choices.length).fill(0) };

      //   await ref
      //     .child(station)
      //     .child('poll_answers')
      //     .child(pushedPollKey)
      //     .update(pollAnswers);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.toString());
    }
  });
});
