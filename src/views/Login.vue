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
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },

  methods: {
    ...mapActions(["validateUser"]),

    submit() {
      this.validateUser({ email: this.email, password: this.password });
    }
  }
};
</script>
