<template>
  <div>
    <p>Login</p>
    <div>
      <label for="email">Email</label>
      <input type="email" placeholder="name@mail.com" v-model="email">
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" v-model="password">
    </div>
    <button @click="submit">Login</button>
  </div>
</template>

<script>
import { firebase } from "./../store/vuex-easy-firestore";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },

  methods: {
    submit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () =>
            this.$router.push({ name: this.$route.query.redirect || "home" }),
          error => console.error(error)
        );
    }
  }
};
</script>

<style>
</style>
