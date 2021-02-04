<template lang="pug">
#album
  Header
  h2(ref='albumHilight')
    span(v-html='$route.query.year')
    | 年
    span(v-html='$route.query.month')
    | 月
  article.album
    img.album__img(:src='get_photo().imgSrc')
    p.album__message(v-html='get_photo().message')
    p.album__name(v-html='get_photo().name')
  .blocks-wrap(v-if='get_photos().length > 0')
    Block(
      v-for='album in get_photos()',
      :key='album.id',
      :id='album.id',
      :postMonth='album.postMonth',
      :imgSrc='album.imgSrc'
    )
  SideButton(
    :isAlbum='isAlbum',
    :message='encodeURIComponent(get_photo().message)',
    :url='encodeURIComponent(url + get_path())'
  )
  TopButton(
    :buttonId='"#album_" + $route.query.year + "_" + $route.query.month'
  )
  BgAnimation
  Loading
  Footer
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Album',
  scrollToTop: true,
  async fetch({ query, store, error }) {
    const id = query.id
    const year = query.year
    const month = query.month
    await store
      .dispatch('album/AllPhotos', {
        id,
        year,
        month,
      })
      .then(() => {
        if (store.getters['album/get_thisMonthAlbumPhoto']().length === 0) {
          return error({ statusCode: 404 })
        }
      })
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('album/replacealbums', {
      id: to.query.id,
      year: to.query.year,
      month: to.query.month,
    })
    const hilight = this.$refs.albumHilight
    const rect = hilight.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const myTop = rect.top + scrollTop
    window.scrollTo(0, myTop)
    next()
  },
  data() {
    return {
      isAlbum: true,
      message: '',
      url: process.env.BASE_URL,
    }
  },
  computed: {
    ...mapGetters({
      get_path: 'album/get_path',
      get_photo: 'album/get_thisMonthAlbumPhoto',
      get_photos: 'album/get_thisMonthAlbumOtherPhotos',
    }),
  },
  methods: {
    extractId(id) {
      return this.albumsArray.filter((v) => {
        return v.id === id
      })
    },
  },
  head() {
    return {
      title: `${this.get_photo().message} |  ${process.env.title}`,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'album' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.get_photo().message} | ${process.env.title}`,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: process.env.description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.get_photo().imgSrc,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: process.env.BASE_URL + this.get_path(),
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.get_photo().message} | ${process.env.title}`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: process.env.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.get_photo().imgSrc,
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.BASE_URL + this.get_path(),
        },
      ],
    }
  },
}
</script>

<style lang="scss">
#album {
  h2 {
    color: $main_color;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
  }

  .album {
    width: 960px;
    margin: 0 auto;
    color: $main_color;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    background: $white;
    word-wrap: break-word;
    margin-top: 25px;
    border: 2px solid $main_color;
    &__img {
      width: 100%;
      vertical-align: top;
      border-radius: 5px 5px 0 0;
    }
    &__message {
      font-size: 1.2rem;
      line-height: 1.5;
      margin-top: 10px;
    }
    &__name {
      font-size: 1rem;
      text-align: right;
      margin-top: 5px;
    }
  }

  .blocks-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 80px;
  }

  @include mq-down(lg) {
    .album {
      width: 94%;
    }
  }

  @include mq-down(md) {
    h2 {
      font-size: get_vw(16);
    }

    .album {
      padding: 0 0 10px;
      margin-top: 15px;
      &__message,
      &__name {
        padding: 0 5px;
        box-sizing: border-box;
      }
      &__message {
        font-size: get_vw(12);
        margin-top: 10px;
      }
      &__name {
        font-size: get_vw(10);
        margin-top: 5px;
      }
    }

    .blocks-wrap {
      margin-top: 40px;
    }
  }
}
</style>
