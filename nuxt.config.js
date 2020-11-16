import Prismic from 'prismic-javascript'
import linkResolver from './app/prismic/link-resolver'

export default {
  target: 'static',
  server: {
    port: 8000, // default: 3000
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'PRON',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
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
    '@aceforth/nuxt-netlify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/prismic',
    'portal-vue/nuxt'
  ],
  prismic: {
    endpoint: 'https://pron.cdn.prismic.io/api/v2',
    linkResolver: linkResolver,
    preview: process.env.NODE_ENV !== 'production'
  },
  netlify: { 
    mergeSecurityHeaders: true 
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
      // Remove SVG from default Nuxt webpack rules
      const svgRule = config.module.rules.find((rule) =>
          rule.test.test(".svg")
      )
      svgRule.test = /\.(png|jpe?g|gif|webp)$/i

      // Use SVG loader for .svg files
      config.resolve.extensions.push(".svg")
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          "babel-loader",
          {
            loader: "vue-svg-loader",
            options: {
              svgo: {
                plugins: [{ removeViewBox: false }],
              },
            },
          },
        ],
      })      
    }
  },
  /*
  ** Customize router
  */  
  router: {

  },
  generate: {
    routes() {
      const projects = Prismic.getApi('https://pron.cdn.prismic.io/api/v2').then((api) => {
        return api
          .query(Prismic.Predicates.at('document.type', 'project'))
          .then(response => {
            return response.results.map(doc => linkResolver(doc))
          })
      })

      const exhibitedProjects = Prismic.getApi('https://pron.cdn.prismic.io/api/v2').then((api) => {
        return api
          .query(Prismic.Predicates.at('document.type', 'exhibited_project'))
          .then(response => {
            return response.results.map(doc => linkResolver(doc))
          })
      })       

      return Promise.all([projects, exhibitedProjects]).then(values => {
        return [...values[0], ...values[1]]
      })      
    }
  }
}
