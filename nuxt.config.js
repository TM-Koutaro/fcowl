import wp from './modules/wp'
const articlesId = []

require('dotenv').config()

const {
  REST_API_URL,
  FB_API_KEY,
  FB_AUTH_DOMAIN,
  WP_FB_DATABASE_URLAPI,
  FB_PROJECTID,
  FB_STORAGE_BUCKET,
  FB_MESSAGING_SENDER_ID,
  FB_APP_ID,
  FB_MEASUREMENTID,
  AWS_S3_BUCKETNAME,
  AWS_S3_REGION,
  AWS_S3_ACCESSKEYID,
  AWS_S3_SECRETACCESSKEY,
} = process.env

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  loading: {
    color: '#d4af37',
    height: '5px',
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Cinzel+Decorative:700|Cinzel:400,700&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap',
      },
    ],
  },
  /*
   ** generate
   */
  generate: {
    interval: 500,
    async routes() {
      const wpArticles = await wp
        .generateArticles()
        .then((articles) => {
          return articles.map((article) => {
            articlesId.push(`/article/${article.id}`)
            return `/article/${article.id}`
          })
        })
        .catch((e) => {
          throw e
        })
      return wpArticles
    },
  },
  /*
   ** Global CSS
   */
  css: ['~/static/css/swiper-bundle.min.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~plugins/global_filter.js' },
    { src: '~plugins/lazyload.js' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    { path: '~/components/dynamic', global: true },
    { path: '~/components/svg', global: true },
    '~/components',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/netlify-files',
    '@nuxtjs/gtm',
  ],
  /*
   * safari無限ロード対策
   **/
  filenames: {
    app: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
    chunk: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/manifest',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/sitemap',
    '@nuxtjs/amp',
  ],
  /*
   ** Sitemap
   */
  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://fcowl.com/',
    exclude: ['/album'],
    routes: articlesId,
  },
  /*
   * GTM
   **/
  gtm: {
    id: 'GTM-MC9B567',
  },
  /*
   ** env
   */
  env: {
    title: 'Order Of The Owl',
    description: 'ファイナルファンタジーXIV Shinryu World にて活動中の Order Of The Owl Free Company サイトです。',
    REST_API_URL,
    FB_API_KEY,
    FB_AUTH_DOMAIN,
    WP_FB_DATABASE_URLAPI,
    FB_PROJECTID,
    FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID,
    FB_APP_ID,
    FB_MEASUREMENTID,
    AWS_S3_BUCKETNAME,
    AWS_S3_REGION,
    AWS_S3_ACCESSKEYID,
    AWS_S3_SECRETACCESSKEY,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },
  styleResources: {
    scss: [
      '~/assets/scss/reset.scss',
      '~/assets/scss/mixin.scss',
      '~/assets/scss/fonts.scss',
      '~/assets/scss/colors.scss',
      '~/assets/scss/site.scss',
      '~/assets/scss/swiper.scss',
    ],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
    router
  */
  router: {
    base: '/',
    linkActiveClass: 'active-link',
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
    terser: {
      terserOptions: {
        compress: { drop_console: true },
      },
    },
    loaders: {
      vue: {
        transformAssetUrls: {
          video: 'src',
        },
      },
    },
  },
}
