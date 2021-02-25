<template lang="pug">
p.button
  NuxtLink.active-link(:to="`/${buttonId}`") トップへ戻る
</template>

<script>
import { Vue, Component } from 'nuxt-property-decorator'
@Component({
  props: {
    buttonId: {
      default: '',
      type: String
    }
  }
})
export default class TopButton extends Vue {}
</script>

<style lang="scss" scoped>
.button {
  text-align: center;
  margin-top: 80px;
  a,
  button {
    display: block;
    max-width: 400px;
    height: 70px;
    line-height: 70px;
    background: $white;
    font-size: 1.4rem;
    color: $main_color;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
    border: 2px solid $main_color;
    box-sizing: border-box;
    text-shadow: none;
    margin: 0 auto;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  @include mq-down(md) {
    margin-top: 40px;
    a,
    button {
      height: get_vw(50);
      line-height: get_vw(50);
      font-size: get_vw(16);
      width: 90%;
      max-width: 90%;
    }
  }
}
</style>
