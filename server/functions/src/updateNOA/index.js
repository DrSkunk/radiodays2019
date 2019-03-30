import { https } from 'firebase-functions';
import { firebase as admin, checkAll } from '../util';
const cors = require('cors')({
  origin: true
});

const db = admin.database();

const ref = db.ref('/');

export default https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const { station, artist, song, album, art } = req.body;
    checkAll({ station, artist, song, album });
    console.log(req.body);
    const newData = { artist, song, album };
    if (art !== undefined) {
      newData.art = art;
    }
    ref
      .child(station)
      .child('now_on_air')
      .set(newData);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});
