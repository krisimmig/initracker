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

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function submit(): void {
  // Firebase registration logic disabled
}
</script>
