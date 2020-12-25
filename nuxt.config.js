import webpack from 'webpack';
import colors from 'vuetify/es5/util/colors';

export default {
  head: {
    titleTemplate: '%s - Polski Mathandel',
    title: 'Polski Mathandel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/stylelint-module', '@nuxtjs/vuetify', '@nuxtjs/composition-api'],
  modules: [
    '@nuxtjs/pwa',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyC7pKufnndO6EZupwgs3PWDDazdTOUZwoA',
          authDomain: 'mathandelpl.firebaseapp.com',
          databaseURL: 'https://mathandelpl.firebaseio.com',
          projectId: 'mathandelpl',
          storageBucket: 'mathandelpl.appspot.com',
          messagingSenderId: '557421567243',
          appId: '1:557421567243:web:b70d220239dd3bf4ba960e',
          measurementId: 'G-T2T6EGPD9F',
        },
        services: {
          auth: true,
          database: true,
        },
      },
    ],
  ],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {
    extend(config) {
      config.devtool = 'source-map';
    },
    transpile: ['js-bbcode-parser'],
    plugins: [
      new webpack.DefinePlugin({
        GH_TOKEN: JSON.stringify(process.env.GH_TOKEN),
      }),
    ],
  },
  generate: {
    // https://composition-api.nuxtjs.org/getting-started/setup
    interval: 2000,
  },
};
