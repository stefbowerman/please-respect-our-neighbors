import Prismic from 'prismic-javascript'
import linkResolver from './app/prismic/link-resolver'

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
    preview: process.env.NODE_ENV !== 'production'
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
  },
  /*
  ** Customize router
  */  
  router: {

  },
  // generate: {
  //   routes() {
  //     // Prismic.api('https://pron.cdn.prismic.io/api/v2', (err, api) => {
  //     //   api.query('').then(response => {
  //     //     const routes = response.documents.map((doc) => linkResolver(doc))
  //     //     console.log(routes)
  //     //   })
  //     // })
  //     // Figure out how to do this
  //     // Prismic.api('https://pron.cdn.prismic.io/api/v2', (err, api) => {
  //     //   api.query(Prismic.Predicates.at('document.type', 'blog-post'),, options, function(err, response) { // An empty query will return all the documents
  //     //     if (err) {
  //     //       console.log("Something went wrong: ", err);
  //     //     }
  //     //     console.log("Documents: ", response.documents);
  //     //   });
  //     // })


  //     // const projectsData = await this.$prismic.api.query(
  //     //   this.$prismic.predicates.at('document.type', 'project')
  //     // )

  //     // const routes = projectsData.results.map(project => `/project/${project.uid}`)

  //     // return []
  //   }
  // }
}
