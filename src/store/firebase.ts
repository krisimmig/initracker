import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

// Enable offline persistence (IndexedDB cache)
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence unavailable: multiple tabs open')
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this browser')
  }
});

// Resolves once Firebase has restored auth state from the session (fires once on startup)
let resolveAuthReady: (user: firebase.User | null) => void
const authReady = new Promise<firebase.User | null>((resolve) => {
  resolveAuthReady = resolve
})
firebaseApp.auth().onAuthStateChanged((user) => resolveAuthReady(user))

// Helper
function isLoggedIn() {
  return !!firebaseApp.auth().currentUser;
}

export { db, firebase, firebaseApp, isLoggedIn, authReady };
