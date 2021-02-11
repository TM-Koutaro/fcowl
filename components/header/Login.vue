<template lang="pug">
.login
  template(v-if='!getStatus')
    a(href='#', @click='twitterLogin()')
      | Login
      Twitter.login__twitter
  template(v-if='getStatus')
    a(href='#', @click='twitterLogout()')
      | Logout
      span.login__face(
        :style='{ backgroundImage: "url(" + getStatus.photoURL + ")" }'
      )
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getStatus: 'login/getStatus'
    })
  },
  mounted() {
    this.twitterLoginCheck()
  },
  methods: {
    twitterLoginCheck() {
      this.$store.dispatch('login/twitterLoginCheck')
    },
    twitterLogin() {
      this.$store.dispatch('login/twitterLogin')
    },
    twitterLogout() {
      if (window.confirm('ログアウトしますか？')) {
        this.$store.dispatch('login/twitterLogout')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 50px;
  line-height: 50px;
  font-size: 2rem;
  color: $main_color;
  font-weight: bold;
  font-family: 'Harry Potter Regular', sans-serif;
  text-align: center;
  max-width: 100%;
  z-index: 100;
  margin: 50px auto 0;
  &__face,
  &__twitter {
    margin-left: 10px;
  }
  > svg,
  &__face {
    position: relative;
    top: 2px;
    &:hover {
      cursor: pointer;
    }
  }
  &__twitter {
    height: 40px;
    vertical-align: middle;
    fill: $main_color;
  }
  &__face {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: grey;
    background-size: cover;
    vertical-align: middle;
  }
  &:hover {
    cursor: pointer;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  @include mq-down(md) {
    font-size: get_vw(14);
    margin-top: get_vw(10);
    &__face {
      width: get_vw(30);
      height: get_vw(30);
    }
    &__twitter {
      height: get_vw(30);
    }
  }
}
</style>
