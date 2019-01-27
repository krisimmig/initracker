import Firebase from 'firebase';
import '@firebase/firestore';

const firebase = Firebase.initializeApp({
  apiKey: 'AIzaSyBnsD8E9GV10_rSaifr0FYNJpurrWJWGtY',
  authDomain: 'initracker-kkk.firebaseapp.com',
  databaseURL: 'https://initracker-kkk.firebaseio.com',
  projectId: 'initracker-kkk',
  storageBucket: 'initracker-kkk.appspot.com',
  messagingSenderId: '783827330434',
});

// Firestore DB
const db = firebase.firestore();

// Helper
function isLoggedIn() {
  return !!firebase.auth().currentUser;
}

export { isLoggedIn, firebase, db };
