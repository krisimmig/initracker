<template>
  <div>
    <PageTitle title="Welcome" icon="mdi-login" />

    <v-container style="max-width: 480px;">
      <v-card rounded="lg" class="pa-2">
        <v-tabs v-model="activeTab" color="primary" grow>
          <v-tab value="signin">Sign In</v-tab>
          <v-tab value="signup">Sign Up</v-tab>
        </v-tabs>

        <v-card-text>
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>

          <!-- Sign In Form -->
          <v-form v-if="activeTab === 'signin'" @submit.prevent="handleSignIn">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[rules.required, rules.email]"
              class="mb-2"
            />
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required]"
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              block
              size="large"
              :loading="isLoading"
            >
              Sign In
            </v-btn>
          </v-form>

          <!-- Sign Up Form -->
          <v-form v-if="activeTab === 'signup'" @submit.prevent="handleSignUp">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[rules.required, rules.email]"
              class="mb-2"
            />
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.minLength]"
              class="mb-2"
            />
            <v-text-field
              v-model="confirmPassword"
              label="Confirm password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check-outline"
              :rules="[rules.required, rules.passwordMatch]"
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              block
              size="large"
              :loading="isLoading"
            >
              Create Account
            </v-btn>
          </v-form>

          <!-- Divider -->
          <div class="d-flex align-center my-5">
            <v-divider />
            <span class="mx-3 text-medium-emphasis text-body-2">or</span>
            <v-divider />
          </div>

          <!-- Social Login Buttons -->
          <div class="d-flex flex-column ga-3">
            <v-btn
              variant="outlined"
              block
              size="large"
              prepend-icon="mdi-google"
              :loading="isLoadingGoogle"
              @click="handleGoogleSignIn"
            >
              Continue with Google
            </v-btn>
            <v-btn
              variant="outlined"
              block
              size="large"
              prepend-icon="mdi-twitter"
              :loading="isLoadingTwitter"
              @click="handleTwitterSignIn"
            >
              Continue with Twitter
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/store/useUsersStore'
import PageTitle from '@/components/common/PageTitle.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const activeTab = ref('signin')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isLoadingGoogle = ref(false)
const isLoadingTwitter = ref(false)

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Enter a valid email',
  minLength: (v: string) => v.length >= 6 || 'At least 6 characters',
  passwordMatch: (v: string) => v === password.value || 'Passwords do not match',
}

function redirectAfterAuth() {
  const redirect = route.query.redirect as string
  router.push({ name: redirect || 'home' })
}

function handleFirebaseError(error: any) {
  const code = error?.code || ''
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  }
  errorMessage.value = messages[code] || error?.message || 'An unexpected error occurred.'
}

async function handleSignIn() {
  errorMessage.value = ''
  isLoading.value = true
  try {
    await usersStore.validateUser({ email: email.value, password: password.value })
    redirectAfterAuth()
  } catch (error) {
    handleFirebaseError(error)
  } finally {
    isLoading.value = false
  }
}

async function handleSignUp() {
  errorMessage.value = ''
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }
  isLoading.value = true
  try {
    await usersStore.registerUser({ email: email.value, password: password.value })
    redirectAfterAuth()
  } catch (error) {
    handleFirebaseError(error)
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleSignIn() {
  errorMessage.value = ''
  isLoadingGoogle.value = true
  try {
    await usersStore.signInWithGoogle()
    redirectAfterAuth()
  } catch (error) {
    handleFirebaseError(error)
  } finally {
    isLoadingGoogle.value = false
  }
}

async function handleTwitterSignIn() {
  errorMessage.value = ''
  isLoadingTwitter.value = true
  try {
    await usersStore.signInWithTwitter()
    redirectAfterAuth()
  } catch (error) {
    handleFirebaseError(error)
  } finally {
    isLoadingTwitter.value = false
  }
}
</script>
