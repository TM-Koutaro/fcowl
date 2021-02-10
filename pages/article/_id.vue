<template lang="pug">
#articleWrap
  Header
  h2.blog-title
    BlogLogo(data-text='地下放送オウル・ウォッチ')
  article.article(ref='article')
    h1(v-html='downloadSinglePage.title.rendered')
    p.time(
      v-html='`${new Date(downloadSinglePage.date).getFullYear()}-${new Date(downloadSinglePage.date).getMonth() + 1}-${new Date(downloadSinglePage.date).getDate()}`'
    )
    .article__contents(v-html='downloadSinglePage.content.rendered')
    .article__twitter
      a(
        :href='`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`',
        target='_blank'
      )
        Twitter
    a.article__writer(
      :href='`${downloadUser.url}`',
      :class='{ noActive: downloadUser.url === "" }',
      ref='article__writer',
      target='_blank',
      v-if='downloadUser.acf.profile_img'
    )
      img(:src='`${downloadUser.acf.profile_img.url}`')
  section.relate(v-if='downloadAuthor.length >= 2')
    h2 他の地下放送も見てくれよな！
    .relate__articles
      template(v-for='article in downloadAuthor')
        NuxtLink.blocks(
          :to='`/article/${article.id}/`',
          v-if='article.id != downloadSinglePage.id'
        )
          .blocks__img(
            :style='{ backgroundImage: `url(${article.better_featured_image.source_url})` }'
          )
          h3(v-html='article.title.rendered')
  TopButton(:buttonId='buttonId')
  BgAnimation
  Loading
  Footer
</template>

<script>
export default {
  name: 'Article',
  scrollToTop: true,
  async asyncData({ route, error }) {
    const result = {}
    await import('~/modules/wp')
      .then(async (module) => {
        const wp = new module.WpApi()
        const id = route.params.id
        // 記事取得
        result.downloadSinglePage = await wp.downloadSinglePage(id)
        result.title = `${result.downloadSinglePage.title.rendered} | Order Of The Owl`
        result.description = result.downloadSinglePage.content.rendered
          .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
          .replace(/\s+/g, '')
          .slice(0, 90)
        result.ogpImg =
          result.downloadSinglePage.better_featured_image.source_url
        result.url = process.env.BASE_URL + 'article/' + route.params.id + '/'
        result.userID = result.downloadSinglePage.author
        // ユーザーの関連記事取得
        result.downloadAuthor = await wp.downloadAuthor(result.userID)
        // ユーザー情報取得
        result.downloadUser = await wp.downloadUser(result.userID)
      })
      .catch((e) => {
        return error({ statusCode: 404 })
      })
    return result
  },
  data() {
    return {
      buttonId: '#blog'
    }
  },
  activated() {
    console.log('activated')
    window.addEventListener('scroll', this.handleScroll)
  },
  deactivated() {
    console.log('破壊')
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const endBotton =
        this.$refs.article.getBoundingClientRect().bottom - window.innerHeight
      const articleTop = this.$refs.article.getBoundingClientRect().top
      if (endBotton < 0) {
        this.$refs.article__writer.classList.remove('on')
      } else if (articleTop <= 0) {
        this.$refs.article__writer.classList.add('on')
      } else {
        this.$refs.article__writer.classList.remove('on')
      }
    }
  },
  head() {
    return {
      title: this.$options.filters.unEscapeHTML(this.title),
      link: [
        {
          rel: 'canonical',
          href: process.env.BASE_URL + this.$route.path
        }
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$options.filters.unEscapeHTML(this.title)
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.description
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.ogpImg
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
          content: this.$options.filters.unEscapeHTML(this.title)
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.description
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.ogpImg
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
#articleWrap {
  .blog-title {
    width: 100%;
    padding: 15px 0;
    font-size: 2rem;
    text-align: center;
    font-weight: bold;
    color: $white;
    background: $main_color;
    position: relative;
    z-index: 10;
    svg {
      width: 400px;
      path {
        fill: $white;
      }
    }
    @include mq-down(md) {
      svg {
        width: 80%;
      }

      font-size: 1.2rem;
      padding: 10px 0;
    }
  }

  .article,
  .relate {
    padding-left: 5%;
    padding-right: 5%;
    @include mq-down(md) {
      padding-left: 2%;
      padding-right: 2%;
    }
  }
  .article {
    width: 100%;
    background: $white;
    color: $main_color;
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
    z-index: 10;
    padding-top: 50px;
    padding-bottom: 50px;
    h1 {
      font-size: 2.7rem;
      line-height: 1.2;
      font-weight: bold;
      border-bottom: $main_color solid 5px;
      padding-bottom: 10px;
    }
    .time {
      margin-top: 5px;
      padding-top: 10px;
      border-top: 5px solid $main_color;
      text-align: right;
      font-weight: bold;
    }
    &__contents {
      font-size: 1.2rem;
      line-height: 2;
      padding-top: 30px;
      word-wrap: break-word;
      img {
        display: block;
        max-width: 800px;
        height: auto;
        margin: 30px 0 10px;
        border: 1px solid $main_color;
        box-sizing: border-box;
        padding: 5px;
      }
    }
    &__writer {
      height: 350px;
      position: fixed;
      right: 20px;
      z-index: 100;
      transition: 0.5s;
      bottom: -350px;
      &.on {
        bottom: 0;
      }
      &.noActive {
        pointer-events: none;
      }
      img {
        height: 100%;
        vertical-align: top;
      }
    }
    &__twitter {
      text-align: center;
      margin-top: 40px;
      svg {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background: $twitter_color;
        padding: 10px;
        path {
          fill: $white;
        }
      }
      &:hover {
        cursor: pointer;
      }
    }
    @include mq-down(md) {
      padding-top: 25px;
      padding-bottom: 25px;
      h1 {
        font-size: get_vw(25);
        border-bottom: $black solid 2px;
      }
      .time {
        font-size: get_vw(12);
        border-top: 2px solid $black;
      }
      &__contents {
        font-size: get_vw(14);
        img {
          max-width: 100%;
        }
      }
      &__twitter {
        margin-top: get_vw(30);

        svg {
          width: get_vw(30);
          height: get_vw(30);
        }
      }
      &__writer {
        height: get_vw(150);
        transition: 0.5s;
        bottom: get_vw(-150);
      }
    }
  }
  .relate {
    margin-top: 50px;
    h2 {
      font-size: 2rem;
      font-weight: bold;
      color: $main_color;
    }
    &__articles {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .blocks {
      display: flex;
      align-items: center;
      width: 31%;
      background: $white;
      border-radius: 20px;
      padding: 10px;
      margin-top: 20px;
      text-decoration: none;
      &__img {
        width: 150px;
        height: 150px;
        border-radius: 100%;
        background-size: cover;
        background-position: center center;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
      h3 {
        padding: 7px 20px;
        font-size: 1.5rem;
        line-height: 1.5;
        font-weight: bold;
        color: $main_color;
        text-align: center;
      }
      &:hover {
        opacity: 0.8;
        transition: 0.5s;
      }
    }
    @include mq-down(md) {
      h2 {
        font-size: get_vw(15);
      }
      &__articles {
        margin-top: 10px;
      }
      .blocks {
        width: 100%;
        border-radius: 0;
        h3 {
          font-size: get_vw(14);
        }
        &__img {
          height: get_vw(75);
          width: get_vw(75);
        }
      }
    }
  }
}
</style>
