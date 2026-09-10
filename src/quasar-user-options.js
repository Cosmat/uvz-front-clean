// Quasar User Options
// https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework

export default {
  config: {
    // Brand colors are now in quasar.conf.js
  },
  plugins: {
    Notify: {
      position: 'top',
      timeout: 3000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }]
    },
    Loading: {
      color: 'primary',
      size: '2rem'
    },
    Dialog: {}
  }
}