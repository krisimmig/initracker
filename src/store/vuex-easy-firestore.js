import Firebase from "firebase";
require("firebase/firestore");

import createEasyFirestore from "vuex-easy-firestore";
import npcsDataModule from "./npcsDataModule";
import usersDataModule from "./usersDataModule";
import charactersDataModule from "./charactersDataModule";

// Initialize the ain firbase app first.
const firebase = Firebase.initializeApp({
  apiKey: "AIzaSyBnsD8E9GV10_rSaifr0FYNJpurrWJWGtY",
  authDomain: "initracker-kkk.firebaseapp.com",
  databaseURL: "https://initracker-kkk.firebaseio.com",
  projectId: "initracker-kkk",
  storageBucket: "initracker-kkk.appspot.com",
  messagingSenderId: "783827330434"
});

// This setting prevents error messages on initialization.
const settings = { timestampsInSnapshots: true };
const firestore = firebase.firestore();
firestore.settings(settings);

const storeDataModules = [
  usersDataModule,
  npcsDataModule,
  charactersDataModule
];

// Setup the easy-firestore modules.
// REMEMBER: When adding a new module, its connectio to the firestore needs to be opened
// with an action in the store.js file.
// i.e. store.dispatch("npcsData/openDBChannel");.
const easyFirestore = createEasyFirestore(storeDataModules, {
  logging: true
});

export { easyFirestore, firebase };
