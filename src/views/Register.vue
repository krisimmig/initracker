<template>
  <div>
    <p>Register</p>
    <div>
      <label for="email">Email</label>
      <input type="email" placeholder="name@mail.com" v-model="email">
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" v-model="password">
    </div>
    <button @click="submit">Submit</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { firebase } from './../store/firebase';

@Component
export default class Register extends Vue {
  public email: string = '';
  public password: string = '';

  public submit(): void {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(
        () =>
          this.$router.push({ name: this.$route.query.redirect || 'home' }),
        (error) => console.error(error),
      );
  }
}
</script>

<style>
</style>
