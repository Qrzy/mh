import firebaseApp from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConf = {
  apiKey: 'AIzaSyC7pKufnndO6EZupwgs3PWDDazdTOUZwoA',
  authDomain: 'mathandelpl.firebaseapp.com',
  databaseURL: 'https://mathandelpl.firebaseio.com',
  projectId: 'mathandelpl',
  storageBucket: 'mathandelpl.appspot.com',
  messagingSenderId: '557421567243',
  appId: '1:557421567243:web:b70d220239dd3bf4ba960e',
  measurementId: 'G-T2T6EGPD9F',
};

firebaseApp.apps.length || firebaseApp.initializeApp(firebaseConf);

export const firebase = firebaseApp;
