import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: { defaultSet: 'mdi' },

  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f4f5f7',
          surface:    '#f5f5f5',
          primary:    '#4A6FA5',
          secondary:  '#6b7280',
          success:    '#2e7d5e',
          warning:    '#b45309',
          error:      '#c0392b',
          info:       '#4A6FA5',
          'on-background': '#1d2944',
          'on-surface':    '#1d2944',
          'on-primary':    '#ffffff',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#282853',
          surface:    '#32326a',
          primary:    '#ba600c',
          secondary:  '#9ca3af',
          success:    '#3fa37a',
          warning:    '#d97706',
          error:      '#e05252',
          info:       '#6b6baa',
          'on-background': '#e5e7eb',
          'on-surface':    '#e5e7eb',
          'on-primary':    '#ffffff',
        },
      },
    },
  },

  // a few changes to the dark theme: base bg color: #282853, borders:  #6b6baa, appbar and primary buttons: #111142 

  defaults: {
    VAppBar: {
      elevation: 0,
    },
    VBtn: {
      rounded: 1,
      elevation: 0,
      class: 'text-uppercase',
    },
    VBtnGroup: {
      rounded: 1,
      elevation: 0,
    },
    VCard: {
      rounded: 1,
      elevation: 0,
      variant: 'elevated',
    },
    VSheet: {
      rounded: 1,
      elevation: 0,
    },
    VTextField: {
      variant: 'underlined',
      rounded: 1,
    },
    VSelect: {
      variant: 'outlined',
      rounded: 1,
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 1,
    },
    VAutocomplete: {
      variant: 'outlined',
      rounded: 1,
    },
    VList: {
      rounded: 1,
      elevation: 0,
    },
    VDialog: {
      rounded: 1,
    },
    VMenu: {
      rounded: 1,
      contentClass: 'app-menu',
    },
    VChip: {
      rounded: 1,
    },
    VAlert: {
      rounded: 1,
    },
    VSnackbar: {
      rounded: 1,
    },
  },
})
