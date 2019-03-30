import { config } from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp(config().firebase);

export default admin;
