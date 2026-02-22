import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: { defaultSet: 'mdi' },
  theme: {
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 2,
      darken: 2,
    },
  },
})
