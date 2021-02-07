import webpack from 'webpack';
import colors from 'vuetify/es5/util/colors';

export default {
  ssr: false,
  head: {
    titleTemplate: '%s - Polski Mathandel',
    title: 'Polski Mathandel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        hid: 'thesemetrics',
        src: 'https://unpkg.com/thesemetrics@latest',
        async: true,
        type: 'text/javascript',
      },
    ],
  },
  css: [],
  plugins: [],
  serverMiddleware: [{ path: '/api', handler: '~/serverMiddleware/api.js' }],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/stylelint-module', '@nuxtjs/vuetify', '@nuxtjs/composition-api'],
  modules: ['@nuxtjs/pwa'],
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
