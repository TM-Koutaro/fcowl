<template lang="pug">
header.header
  h1(data-text='Order Of The Owl')
    NuxtLink(to='/')
      TitleLogo
  p.header__server Shinryu World
  Login
</template>

<script>
import Login from '~/components/header/Login.vue'

export default {
  name: 'Header',
  components: {
    Login,
  },
}
</script>

<style lang="scss" scoped>
.header {
  padding: 80px 0;
  color: $white;
  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    a {
      color: inherit;
      text-decoration: none;
      svg {
        width: 700px;
      }
    }
  }
  &__server {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
  }
  @include mq-down(md) {
    padding: 12vw 0;
    h1 {
      a {
        width: 90%;
        svg {
          width: 100%;
        }
      }
    }
    &__server {
      margin-top: 10px;
      font-size: get_vw(25);
    }
  }
}

@keyframes noise-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      clip: rect(random(100) + px, 9999px, random(100) + px, 0);
    }
  }
}
</style>
