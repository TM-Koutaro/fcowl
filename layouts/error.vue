<template lang="pug">
#error
  Header
  h2 
    | エラーが発生しました。
    br
    NuxtLink(to='/') トップページに戻る
  Loading
  BgAnimation
  Footer
</template>

<script>
export default {
  name: 'Error',
  head() {
    return {
      title: process.env.title,
      link: [
        {
          rel: 'canonical',
          href: process.env.BASE_URL,
        },
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: process.env.description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: process.env.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: process.env.description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: process.env.BASE_URL + 'ogp.png',
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: process.env.BASE_URL,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: process.env.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: process.env.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: process.env.BASE_URL + 'ogp.png',
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.BASE_URL,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
h2 {
  width: 500px;
  font-size: 1.8rem;
  background: $black;
  padding: 40px 0;
  color: $white;
  text-align: center;
  margin: 0 auto;
  border-radius: 10px;
  a {
    display: inline-block;
    color: inherit;
    font-size: 1.3rem;
    margin-top: 30px;
  }

  @include mq-down(md) {
    width: 90%;
    padding: 30px 0;
    font-size: get_vw(14);
    a {
      font-size: get_vw(12);
      margin-top: get_vw(20);
    }
  }
}
</style>
