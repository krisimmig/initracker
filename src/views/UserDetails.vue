<template>
  <div class="UserDetails">
    <div class="">
      <PageTitle
        title="User Details"
      />

      <div class="card w-3/12">
        <img :src="photoUrl" alt="User Avatar" class="mb-4">
        <p><span class="font-bold">Name:</span> {{ displayName }}</p>
        <p><span class="font-bold">Created:</span> {{ displayName }}</p>
        <p><span class="font-bold">Created:</span> {{ email }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import PageTitle from '@/components/common/PageTitle.vue';
  import { readUserEmail, readUserPhotoUrl, readUserString } from '@/store/usersModule';

  @Component({
    components: {
      PageTitle,
    },
  })
  export default class UserDetails extends Vue {
    public get photoUrl() {
      return readUserPhotoUrl(this.$store);
    }

    public get displayName() {
      return readUserString(this.$store);
    }

    public get email() {
      return readUserEmail(this.$store);
    }
  }
</script>

