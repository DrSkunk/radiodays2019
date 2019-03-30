import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initalize and export Firebase.
const config = {
  apiKey: 'AIzaSyB7lp6Q0tYBiXqV_fVC2rEAQBf0bgszhUs',
  authDomain: 'test-rhe.firebaseapp.com',
  databaseURL: 'https://test-rhe.firebaseio.com',
  projectId: 'test-rhe',
  storageBucket: 'test-rhe.appspot.com',
  messagingSenderId: '1032064393282'
};

export default firebase.initializeApp(config);
