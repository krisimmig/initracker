<template>
  <div class="Feedback">
    <div class="">
      <PageTitle
          title="Feedback"
          subtitle="ways to help improve this app."
      />

      <div class="u-container-fluid">
        <div class="grid grid-cols-2 gap-4">

          <div class="card card--rounded card--shadow">
            <h4 class="h4">Give feedback on reddit</h4>
            <p>We have created a reddit community where we can talk about how this app can be imrpoved or any bugs you might have found. Visit the reddit community here:</p>
            <p>
                <Button is-big is-success is-normal-casing href="https://www.reddit.com/r/DNDToolsParty/new/">
                  /r/DNDToolsParty
                </Button>
            </p>
          </div>

          <div class="card card--rounded card--shadow">
            <h4 class="h4">Subscribe to the newsletter</h4>
            <p>We are sending a newsletter whenever new features are added to YAIT.</p>
            <Button is-big is-success is-normal-casing @click="subscribeNewsletter">
              Subscribe to newsletter
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import PageTitle from '@/components/common/PageTitle.vue';
import Button from '@/components/common/Button.vue';

import { readGetUserObj } from '@/store/usersModule';
import User from 'firebase.User';

@Component
export default class Feedback extends Vue {
  components: {
    Button,
    PageTitle,
  }

  get user(): null | User {
    return readGetUserObj(this.$store);
  }

  subscribeNewsletter() {
    if(this.user) {

    }
  }
}
export default class Feedback extends Vue {}
</script>
