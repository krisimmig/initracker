<template>
  <div>
    <p>User: {{ user.email }}</p>
    <NpcsList />
  </div>
</template>

<script>
import { mapState } from "vuex";

import NpcsList from "../components/NpcsList";

export default {
  components: {
    NpcsList
  },

  computed: {
    ...mapState(["user"])
  }
};
</script>

<style>
</style>
