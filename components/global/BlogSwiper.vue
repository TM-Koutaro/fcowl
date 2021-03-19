<template lang="pug">
.blog-swiper.swiper
  .swiper-wrapper
    .blog-swiper-slide.swiper-slide.swiper-lazy(
      v-for='(article, index) in getWp',
      :key='article.id',
      :data-background='article.better_featured_image.source_url'
    )
      .swiper-lazy-preloader
      NuxtLink(:to='`/article/${article.id}/`')
        New.new(v-if='($dayjs() - $dayjs(article.date)) / 86400000 < 7')
        h3(v-html='article.title.rendered')
  .blog-swiper-button-prev.swiper-button-prev prev
  .blog-swiper-button-next.swiper-button-next next
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { mapGetters } from 'vuex'

@Component({
  computed: mapGetters({
    getWp: 'wp/getWp'
  })
})
export default class BlogSwiper extends Vue {}
</script>

<style scoped lang="scss">
.blog-swiper {
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

  @include mq-down(md) {
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
}
</style>
