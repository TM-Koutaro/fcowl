<template lang="pug">
#top
  Header
  section#blog
    h2
      BlogLogo(data-text='地下放送オウル・ウォッチ')
    .swiper
      .swiper-wrapper
        .swiper-slide.swiper-lazy(
          v-for='(article, index) in getWp',
          :key='article.id',
          :data-background='article.better_featured_image.source_url'
        )
          .swiper-lazy-preloader
          NuxtLink(:to='`/article/${article.id}/`')
            New.new(
              v-if='(new Date() - new Date(article.date)) / 86400000 < 7'
            )
            h3(v-html='article.title.rendered')
      .swiper-button-prev prev
      .swiper-button-next next
  section.blocks
    h2 Album
    template(v-for='thisYear in getAllDatePhotos')
      template(v-for='thisMonth in thisYear[1]')
        h3(:id='"album_" + replaceAlbumText(`${thisYear[0]}/${thisMonth}`)')
          span.title {{ `${thisYear[0]}/${thisMonth}` }}
        template(v-for='photo in extractMonth(`${thisYear[0]}/${thisMonth}`)')
          Block(
            :key='photo.id',
            :id='photo.id',
            :postMonth='photo.postMonth',
            :imgSrc='photo.imgSrc'
          )
  section.calendar
    h2 Calendar
    iframe(
      src='https://calendar.google.com/calendar/embed?src=shinryu.fcowl%40gmail.com&ctz=Asia%2FTokyo',
      frameborder='0',
      scrolling='no'
    )
  BgAnimation
  AboutButton(:title='downloadPage.title.rendered')
  About(:pageSingle='downloadPage')
  SideButton(:url='url')
  Loading
  Footer
</template>

<script>
import { mapGetters } from 'vuex'
import { Swiper, Navigation, Lazy } from 'swiper'
import About from '~/components/top/About.vue'
import AboutButton from '~/components/top/AboutButton.vue'

Swiper.use([Navigation, Lazy])

export default {
  name: 'Top',
  components: {
    Swiper,
    About,
    AboutButton
  },
  async fetch({ store, error }) {
    await import('~/modules/wp')
      .then(async (module) => {
        const wp = new module.WpApi()
        // 記事取得
        const downloadLatestPage = await wp.downloadLatestPage()
        store.commit('wp/setWp', downloadLatestPage)
      })
      .catch((e) => {
        return error({ statusCode: 404 })
      })
  },
  async asyncData({ error }) {
    const result = {}
    await import('~/modules/wp')
      .then(async (module) => {
        const wp = new module.WpApi()
        // About記事取得
        result.downloadPage = await wp.downloadPage(429)
      })
      .catch((e) => {
        return error({ statusCode: 404 })
      })
    return result
  },
  data() {
    return {
      url: process.env.BASE_URL
    }
  },
  computed: {
    ...mapGetters({
      getAllDatePhotos: 'album/getAllDatePhotos',
      getAllPhotos: 'album/getAllPhotos',
      getWp: 'wp/getWp',
      getStatus: 'login/getStatus'
    })
  },
  mounted() {
    // アルバムデータ取得
    this.$store.dispatch('album/addAllDatePhotos').then(() => {
      for (let y = 0; y < this.getAllDatePhotos().length; y++) {
        // 該当年の分だけデータを取得
        const year = this.getAllDatePhotos()[y][0]
        for (let m = 0; m < this.getAllDatePhotos()[y][1].length; m++) {
          // 該当月の分だけデータを取得
          const month = this.getAllDatePhotos()[y][1][m]
          this.$store.dispatch('album/addAllPhotos', {
            year,
            month
          })
        }
      }
    })
    new Swiper('.swiper', {
      preloadImages: false,
      lazy: {
        loadPrevNext: true
      },
      centeredSlides: true,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1
        },
        769: {
          slidesPerView: 3,
          slidesPerGroup: 3
        }
      }
    })
  },
  methods: {
    replaceAlbumText(text) {
      return text.replace('/', '_')
    },
    extractMonth(thisMonth) {
      const thisMonthhArray = []
      this.getAllPhotos().forEach((e) => {
        e.filter((v) => {
          if (v.postMonth === thisMonth) {
            thisMonthhArray.push(v)
          }
        })
      })
      return thisMonthhArray
    },
    isArrayExists(array, value) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (value === array[i]) {
          return true
        }
      }
      return false
    }
  },
  head() {
    return {
      title: process.env.title,
      link: [
        {
          rel: 'canonical',
          href: process.env.BASE_URL
        }
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: process.env.description
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: process.env.title
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: process.env.description
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: process.env.BASE_URL + 'ogp.png'
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: process.env.BASE_URL
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: process.env.title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: process.env.description
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: process.env.BASE_URL + 'ogp.png'
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.BASE_URL
        }
      ]
    }
  }
}
</script>

<style lang="scss">
#top {
  width: 100%;
  height: 100%;
  font-size: 16px;

  .swiper {
    position: relative;
    overflow: hidden;
    &-slide {
      height: 300px;
      position: relative;
      background-size: cover;
      background-position: center;
      .new {
        width: 50px;
        position: absolute;
        right: 10px;
        top: 10px;
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
      }
      h3 {
        width: 100%;
        font-size: 1.2rem;
        font-weight: bold;
        background: $white;
        color: $main_color;
        border-bottom: 5px solid $main_color;
        padding: 10px 0;
        position: absolute;
        left: 0;
        bottom: 0;
        text-align: center;
      }
    }
    &-button-prev,
    &-button-next {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 34px;
      height: 100px;
      margin: auto 0;
      background: $white;
      cursor: pointer;
      font-size: 0;
      transition: 0.5s;
      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 24px;
        height: 24px;
        border-left: 2px solid $black;
        border-top: 2px solid $black;
        border-right: 2px solid transparent;
        border-bottom: 2px solid transparent;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      &::after {
        position: absolute;
        content: '';
        left: -10px;
        top: 0;
        bottom: 0;
        background: $white;
        width: 10px;
      }
    }
    &-button-prev {
      left: 10px;
    }
    &-button-next {
      right: 10px;
      transform: rotate(180deg);
    }
  }

  section ~ section {
    margin-top: 80px;
  }

  h2 {
    position: relative;
    font-size: 3rem;
    font-weight: bold;
    color: $main_color;
    text-align: center;
    width: 100%;
    margin-bottom: 30px;
    svg {
      width: 400px;
      text,
      path {
        fill: $main_color;
      }
    }
  }

  .blocks {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 10;

    h3 {
      width: 20%;
      padding: 7px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 5px solid $main_color;
      box-sizing: border-box;
      .title {
        font-size: 2rem;
        font-weight: bold;
        position: relative;
        z-index: 10;
        color: $main_color;
      }
    }
  }

  .calendar {
    iframe {
      display: block;
      width: 700px;
      height: 500px;
      margin: 0 auto;
      border-radius: 10px;
      border: 5px solid $main_color;
      box-sizing: border-box;
    }
  }

  @include mq-down(md) {
    .movie {
      width: 100%;
      max-width: 100%;
      height: get_vw(200);
    }

    section ~ section {
      margin-top: 60px;
    }

    .swiper {
      &-slide {
        height: get_vw(200);
        h3 {
          font-size: get_vw(14);
        }
      }
      &-button-prev,
      &-button-next {
        display: none;
      }
    }

    h2 {
      font-size: get_vw(20);
      margin-bottom: 20px;
      svg {
        width: get_vw(200);
      }
    }

    .blocks {
      h3 {
        width: 100%;
        height: 200px;
        .title {
          font-size: get_vw(20);
        }
      }
    }
    .calendar {
      iframe {
        width: 100%;
        height: get_vw(350);
        border-radius: 0;
      }
    }
  }
}
</style>
