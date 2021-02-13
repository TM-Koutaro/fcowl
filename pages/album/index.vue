<template lang="pug">
#album
  Header
  h2(ref='albumHilight')
    span(v-html='$route.query.year')
    | 年
    span(v-html='$route.query.month')
    | 月
  article.album
    img.album__img(:src='getPhoto.imgSrc')
    p.album__message(v-html='getPhoto.message')
    p.album__name(v-html='getPhoto.name')
  .blocks-wrap(v-if='getPhotos.length > 0')
    Block(
      v-for='album in getPhotos',
      :key='album.id',
      :id='album.id',
      :postMonth='album.postMonth',
      :imgSrc='album.imgSrc'
    )
  SideButton(
    :isAlbum='isAlbum',
    :message='encodeURIComponent(getPhoto.message)',
    :url='encodeURIComponent(url + getPath)'
  )
  TopButton(
    :buttonId='"#album_" + $route.query.year + "_" + $route.query.month'
  )
  BgAnimation
  Loading
  Footer
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Route, RawLocation } from 'vue-router'
import { Context } from '@nuxt/types'
import { mapGetters } from 'vuex'

@Component({
  scrollToTop: true,
  fetchOnServer: false,
  async fetch(context: Context) {
    const { query, store, error } = context
    const id = query.id
    const year = query.year
    const month = query.month
    await store
      .dispatch('album/addAllPhotos', {
        id,
        year,
        month
      })
      .then(() => {
        if (store.getters['album/getMonthAlbumPhoto'].length === 0) {
          return error({ statusCode: 404 })
        }
      })
  },
  computed: mapGetters({
    getPath: 'album/getPath',
    getPhoto: 'album/getMonthAlbumPhoto',
    getPhotos: 'album/getMonthAlbumOtherPhotos'
  })
})
export default class Album extends Vue {
  data() {
    return {
      isAlbum: true,
      message: '',
      url: process.env.BASE_URL
    }
  }

  $refs!: {
    albumHilight: HTMLElement
  }

  getPath!: string
  getPhoto!: { [index: string]: string }
  getPhotos!: string

  beforeRouteUpdate(
    to: Route,
    from: Route, // eslint-disable-line
    next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
  ) {
    this.$store.dispatch('album/replacealbums', {
      id: to.query.id,
      year: to.query.year,
      month: to.query.month
    })
    const hilight = this.$refs.albumHilight
    const rect = hilight.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const myTop = rect.top + scrollTop
    window.scrollTo(0, myTop)
    next()
  }

  head() {
    return {
      title: `${this.getPhoto.message} |  ${process.env.title}`,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'album' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.description
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.getPhoto.message} | ${process.env.title}`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: process.env.description
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.getPhoto.imgSrc
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: process.env.BASE_URL + this.getPath
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.getPhoto.message} | ${process.env.title}`
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: process.env.description
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.getPhoto.imgSrc
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.BASE_URL + this.getPath
        }
      ]
    }
  }
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
