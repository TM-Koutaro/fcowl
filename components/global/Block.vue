<template lang="pug">
NuxtLink.block.active-link(
  :to='`/album/?id=${id}&year=${postMonth.substr(0, 4)}&month=${postMonth.substr(5, postMonth.length).replace("月", "")}`'
)
  .block__img(:style="{ backgroundImage: 'url(' + imgSrc + ')' }")
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  props: {
    id: {
      default: '',
      type: String
    },
    postMonth: {
      default: '',
      type: String
    },
    imgSrc: {
      default: '',
      type: String
    }
  }
})
export default class Block extends Vue {}
</script>

<style lang="scss" scoped>
.block {
  display: block;
  width: 20%;
  box-sizing: border-box;
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  position: relative;
  transition: 0.5s;

  &:hover {
    opacity: 0.8;
  }

  &__number {
    width: 50px;
    text-align: center;
    line-height: 37px;
    color: $black;
    position: absolute;
    right: 10px;
    top: 10px;

    span {
      position: relative;
      color: $black;
      font-size: 1rem;
      font-weight: bold;
      z-index: 10;
    }

    &::before,
    &::after {
      position: absolute;
      content: '';
      left: 25px;
      top: 0;
      width: 25px;
      height: 40px;
      background: $white;
      border-radius: 35px 35px 0 0;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
      z-index: 0;
    }

    &::after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }
  }

  &__img {
    width: 100%;
    height: 250px;
    background-size: cover;
    background-position: center center;
  }

  @include mq-down(md) {
    width: 100%;

    &__img {
      height: get_vw(200);
    }
  }
}
</style>
