<template>
  <div>
    <h1>All Npcs</h1>
    <ul>
      <li v-for="npc in npcs" :key="npc.id">
        <p>Name: <b>{{ npc.name }}</b></p>
        <p>ID: <em>{{ npc.id }}</em></p>
      </li>
    </ul>

    <h1>All users</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        <p>Name: <b>{{ user.name }}</b></p>
        <p>ID: <em>{{ user.id }}</em></p>
      </li>
    </ul>

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("npcsData", ["npcs"]),
    ...mapState("usersData", ["users"])
  },

  methods: {}
};
</script>

<style scoped lang="scss">
</style>
