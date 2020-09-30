
export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Please Respect Our Neighbors',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },  
  /*
  ** Customize the progress-bar color
  */
  loading: {},
  /*
   ** Global CSS
   */
  css: [
      // "~/styles/css-variables.scss",
      "~/styles/app.scss",
      // "~/styles/transitions.scss",
      // "~/styles/fonts.css" // Be sure to turn on the font loader plugin and config it
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "@nuxtjs/style-resources",
    "@nuxtjs/prismic",
  ],
  prismic: {
    endpoint: 'https://pron.cdn.prismic.io/api/v2',
    // linkResolver: '@/plugins/link-resolver',
    // htmlSerializer: '@/plugins/html-serializer',    
  },
  /*
  ** Build configuration
  */
  build: {
    // This and the transpile code below fix an issue with the spread operator in Safari 10.
    babel: {
      plugins: ["@babel/plugin-proposal-object-rest-spread"],
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
