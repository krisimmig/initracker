<template>
  <div class="Dashboard">
    <h1>Dashboard</h1>
    <h3 v-if="user">User: {{  user.email }}</h3>

    <p>My characters</p>
    <ul>
      <li v-for="(character, key) in characters" :key="key">
        {{ character.name }}
      </li>
    </ul>

    <p>Parties</p>
    <p>My Ecounters</p>
    <p>Official NPCs</p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("charactersData", ["characters"]),
    ...mapState(["user"])
  }
};
</script>

<style>
</style>
