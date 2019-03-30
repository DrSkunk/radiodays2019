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
      const { station, name, options } = req.body;
      console.log('req.body', req.body);
      checkAll({ station, name, options });
      console.log(req.body);
      const poll = { name, options };
      const pushedPollKey = (await ref
        .child(station)
        .child('polls')
        .push(poll)).key;

      const pollAnswers = { name, votes: Array(options.length).fill(0) };

      await ref
        .child(station)
        .child('poll_answers')
        .child(pushedPollKey)
        .update(pollAnswers);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.toString());
    }
  });
});
