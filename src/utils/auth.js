import { firebase } from "../store/vuex-easy-firestore";

function isLoggedIn() {
  return !!firebase.auth().currentUser;
}

export { isLoggedIn };
