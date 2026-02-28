<template>
  <div class="Feedback">
    <PageTitle title="Feedback" icon="mdi-message-draw" />

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center pa-3 pb-0">
            <v-icon color="primary" class="mr-2">mdi-reddit</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Give feedback on Reddit</span>
          </v-card-title>
          <v-card-text class="pa-3">
            <p class="text-body-2 text-medium-emphasis mb-3">
              We have created a Reddit community where we can talk about how this app can be improved or any bugs you might have found.
            </p>
          </v-card-text>
          <v-card-actions class="pa-3 pt-0">
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-open-in-new"
              href="https://www.reddit.com/r/DNDToolsParty/new/"
              target="_blank"
              rel="noopener"
            >
              /r/DNDToolsParty
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center pa-3 pb-0">
            <v-icon color="primary" class="mr-2">mdi-email-newsletter</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Subscribe to the newsletter</span>
          </v-card-title>
          <v-card-text class="pa-3">
            <p class="text-body-2 text-medium-emphasis mb-3">
              We send a newsletter whenever new features are added to YAIT.
            </p>
            <v-text-field
              v-model="newsletterEmail"
              label="Email address"
              placeholder="name@mail.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="compact"
              hide-details="auto"
              type="email"
            />
          </v-card-text>
          <v-card-actions class="pa-3 pt-0">
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-send-outline"
              @click="submitNewsletter"
            >
              Subscribe
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'

const newsletterEmail = ref('')

function submitNewsletter() {
  if (!newsletterEmail.value) return
  const popup = window.open('https://tinyletter.com/dndtoolsparty', 'popupwindow', 'scrollbars=yes,width=800,height=600')
  const form = document.createElement('form')
  form.action = 'https://tinyletter.com/dndtoolsparty'
  form.method = 'post'
  form.target = 'popupwindow'
  const emailInput = document.createElement('input')
  emailInput.type = 'hidden'
  emailInput.name = 'email'
  emailInput.value = newsletterEmail.value
  const embedInput = document.createElement('input')
  embedInput.type = 'hidden'
  embedInput.name = 'embed'
  embedInput.value = '1'
  form.appendChild(emailInput)
  form.appendChild(embedInput)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
  newsletterEmail.value = ''
}
</script>
