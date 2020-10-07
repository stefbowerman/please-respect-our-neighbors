
export default {
  target: 'static',
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
    '~/assets/styles/app.scss'
  ],
  /*
   ** Load SCSS into each component
   */
  styleResources: {
    scss: [
      '~/assets/styles/_variables.scss',
      '~/assets/styles/_mixins.scss'
    ]
  },  
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/global-directive-loader.js' },
    { src: '~/plugins/web-font-loader.client.js', mode: 'client' },
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
    'portal-vue/nuxt'
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
