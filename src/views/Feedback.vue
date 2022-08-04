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
            <form
                class="mt-3"
                action="https://tinyletter.com/dndtoolsparty"
                method="post"
                target="popupwindow"
                onsubmit="window.open('https://tinyletter.com/dndtoolsparty', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true"
            >
              <label for="tlemail" class="text-gray-600 text-sm">Enter your email address</label>
              <input type="text" class="bg-white border w-full rounded px-3 py-2 mb-3 block" name="email" id="tlemail" placeholder="name@mail.com" />

              <input type="hidden" value="1" name="embed"/>
              <input type="submit" value="Subscribe" class="uppercase text-sm font-bold block bg-green-500 text-green-100 rounded px-4 py-1 cursor-pointer hover:bg-green-300 hover:text-green-500" />
            </form>
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

@Component({
  components: {
    Button,
    PageTitle,
  },
})
export default class Feedback extends Vue {
}
</script>
