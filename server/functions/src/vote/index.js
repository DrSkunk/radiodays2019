import { https } from 'firebase-functions';
import { firebase as admin, checkAll } from '../util';
const cors = require('cors')({
  origin: true
});

const db = admin.database();

const ref = db.ref('/');

export default https.onRequest(async (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');
  cors(req, res, async () => {
    try {
      const { station, pollId, choice } = req.body;
      console.log('req.body', req.body);
      checkAll({ station, pollId, choice });

      const poll = (await ref
        .child(station)
        .child('poll_answers')
        .child(pollId)
        .once('value')).val();
      poll.votes[choice] = poll.votes[choice] + 1;

      console.log(poll);

      await ref
        .child(station)
        .child('poll_answers')
        .child(pollId)
        .set(poll);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.toString());
    }
  });
});
