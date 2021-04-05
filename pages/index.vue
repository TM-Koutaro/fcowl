<template lang="pug">
#top
  Header
  section
    h2 ABOUT THIS SITE
    Member
  section#blog
    h2
      BlogLogo(data-text='地下放送オウル・ウォッチ')
    BlogSwiper
  section.blocks
    h2 Peko Studio
    template(v-if='$device.isDesktopOrTablet')
      template(v-for='thisYear in getAllDatePhotos')
        template(v-for='thisMonth in thisYear[1]')
          h3(:id='"album_" + replaceAlbumText(`${thisYear[0]}/${thisMonth}`)')
            span.title {{ `${thisYear[0]}/${thisMonth}` }}
          template(
            v-for='photo in extractMonth(`${thisYear[0]}/${thisMonth}`)'
          )
            Block(
              :key='photo.id',
              :id='photo.id',
              :postMonth='photo.postMonth',
              :imgSrc='photo.imgSrc'
            )
    template(v-else-if='$device.isMobile')
      template(v-for='thisYear in getAllDatePhotos')
        template(v-for='thisMonth in thisYear[1]')
          h3(:id='"album_" + replaceAlbumText(`${thisYear[0]}/${thisMonth}`)')
            span.title {{ `${thisYear[0]}/${thisMonth}` }}
          .swiper-container.swiper
            .swiper-wrapper
              .swiper-slide(
                v-for='photo in extractMonth(`${thisYear[0]}/${thisMonth}`)'
              )
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

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'
import { Context } from '@nuxt/types'
import { Swiper, Navigation, Lazy } from 'swiper'
import About from '~/components/top/About.vue'
import AboutButton from '~/components/top/AboutButton.vue'
import Member from '~/components/top/Member.vue'
Swiper.use([Navigation, Lazy])

@Component({
  async fetch(context: Context) {
    const { store, error } = context
    await import('~/modules/wp')
      .then(async (module) => {
        const wp = new module.WpApi()
        // 記事取得
        const downloadLatestPage: {}[] = await wp.downloadLatestPage()
        store.commit('wp/setWp', downloadLatestPage)
      })
      .catch(() => {
        return error({ statusCode: 404 })
      })
  },
  async asyncData(context: Context) {
    const { error } = context
    const result: { [index: string]: string } = {}
    await import('~/modules/wp')
      .then(async (module) => {
        const wp = new module.WpApi()
        // About記事取得
        result.downloadPage = await wp.downloadPage(429)
      })
      .catch(() => {
        return error({ statusCode: 404 })
      })
    return result
  },
  computed: mapGetters({
    getAllDatePhotos: 'album/getAllDatePhotos',
    getAllPhotos: 'album/getAllPhotos'
  }),
  components: {
    About,
    AboutButton,
    Member
  }
})
export default class Top extends Vue {
  data() {
    return {
      url: process.env.BASE_URL
    }
  }

  getAllDatePhotos!: { [index: string]: string }[]
  getAllPhotos!: []
  getWp!: []

  mounted() {
    // アルバムデータ取得
    this.$store.dispatch('album/addAllDatePhotos').then(() => {
      for (let y = 0; y < this.getAllDatePhotos.length; y++) {
        // 該当年の分だけデータを取得
        const year: string = this.getAllDatePhotos[y][0]
        for (let m = 0; m < this.getAllDatePhotos[y][1].length; m++) {
          // 該当月の分だけデータを取得
          const month: string = this.getAllDatePhotos[y][1][m]
          this.$store
            .dispatch('album/addAllPhotos', {
              year,
              month
            })
            .then(() => {
              if (
                y === this.getAllDatePhotos.length - 1 &&
                m === this.getAllDatePhotos[y][1].length - 1
              ) {
                this.swiperContainer()
              }
            })
        }
      }
    })
    new Swiper('.blog-swiper', {
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
  }

  swiperContainer() {
    document.querySelectorAll('.swiper-container').forEach((e, index) => {
      e.classList.add(`instance-${index}`)
      new Swiper(`.instance-${index}`, {
        preloadImages: false,
        lazy: {
          loadPrevNext: true
        },
        centeredSlides: true,
        loop: true,
        slidesPerView: 1,
        slidesPerGroup: 1
      })
    })
  }

  replaceAlbumText(albumText: string) {
    return albumText.replace('/', '_')
  }

  extractMonth(thisMonth: string) {
    const monthArray: {}[] = []
    this.getAllPhotos.forEach((e: []) => {
      e.filter((v: { postMonth: string }) => {
        if (v.postMonth === thisMonth) {
          monthArray.push(v)
        }
        return true
      })
    })
    return monthArray
  }

  isArrayExists(array: string, value: string) {
    for (let i = 0, len = array.length; i < len; i++) {
      if (value === array[i]) {
        return true
      }
    }
    return false
  }

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
  overflow-x: hidden;

  .swiper-container {
    width: 100%;
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
      margin-top: get_vw(40);
    }

    h2 {
      font-size: get_vw(26);
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
          font-size: get_vw(24);
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
