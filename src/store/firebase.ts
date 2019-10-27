// tslint:disable-next-line:no-var-requires
const firebase = require('firebase');

import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBnsD8E9GV10_rSaifr0FYNJpurrWJWGtY',
  authDomain: 'initracker-kkk.firebaseapp.com',
  databaseURL: 'https://initracker-kkk.firebaseio.com',
  projectId: 'initracker-kkk',
  storageBucket: 'initracker-kkk.appspot.com',
  messagingSenderId: '783827330434',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Firestore DB
const db = firebaseApp.firestore();

// Helper
function isLoggedIn() {
  return !!firebaseApp.auth().currentUser;
}

export { db, firebase, firebaseApp, isLoggedIn };
