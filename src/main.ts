import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import { firebase } from '@/store/firebase'
import { useUsersStore } from '@/store/useUsersStore'
import { useNpcsStore } from '@/store/useNpcsStore'
import '@/css/base.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router).use(vuetify)
app.mount('#app')

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    useUsersStore().loginUser(user)
    useNpcsStore().fetchNpcs()
  }
})
