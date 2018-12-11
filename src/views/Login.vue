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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { dispatchValidateUser } from '../store/usersModule';

@Component
export default class Login extends Vue {
  public email: string = '';
  public password: string = '';

  public submit() {
    dispatchValidateUser(this.$store, { email: this.email, password: this.password });
  }
}
</script>
