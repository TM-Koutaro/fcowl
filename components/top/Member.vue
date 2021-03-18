<template lang="pug">
.member
  .member__inner
    MemberPeko#animate-svg.member__name
    p.member__class サイト管理者
    p.member__description ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。
    video.video(autoplay, loop, muted)
      source(src='movie/peko.mp4')
  ul.member__list
    li
      img(src='img/member_peko.png')
    li
      img(src='img/member_peko.png')
    li
      img(src='img/member_peko.png')
    li
      img(src='img/member_peko.png')
</template>

<script>
import { Vue, Component } from 'nuxt-property-decorator'
import { TimelineMax, CSSPlugin } from 'gsap'
import $ from 'jquery'

@Component()
export default class Member extends Vue {
  mounted() {
    console.log('SVG Animation')
    const tmaxOptionsGlobal = {
      repeat: -1,
      repeatDelay: 0.65,
      yoyo: true
    }

    CSSPlugin.useSVGTransformAttr = true

    const tl = new TimelineMax(tmaxOptionsGlobal)
    const path = '#animate-svg *'
    const staggerVal = 0.0125
    const duration = 0.75

    $.each($(path), function () {
      tl.set($(this), {
        x: '+=' + getRandom(-500, 500),
        y: '+=' + getRandom(-500, 500),
        rotation: '+=' + getRandom(-720, 720),
        scale: 0,
        opacity: 0
      })
    })

    const staggerPptsTo = {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0
    }

    tl.staggerTo(path, duration, staggerPptsTo, staggerVal)

    const $svg = $('#animate-svg')
    $svg.hover(
      function () {
        tl.timeScale(0.15)
      },
      function () {
        tl.timeScale(1)
      }
    )

    function getRandom(min, max) {
      return Math.random() * (max - min) + min
    }
  }
}
</script>

<style lang="scss" scoped>
.member {
  width: 100%;
  color: $main_color;
  font-weight: bold;
  box-sizing: border-box;
  mix-blend-mode: darken;

  &__inner,
  &__list {
    max-width: 800px;
    position: relative;
    margin: 0 auto;
    z-index: 10;

    > *:not(.video) {
      position: relative;
      z-index: 10;
    }
  }

  &__name {
    height: 50px;
    padding-top: 70px;

    path {
      fill: $main_color;
    }
  }

  &__class {
    font-size: 1rem;
    margin-top: 10px;
  }

  &__description {
    max-width: 400px;
    font-size: 1rem;
    line-height: 1.5;
    margin-top: 20px;
  }

  video {
    height: 400px;
    position: absolute;
    right: -100px;
    top: 0;
    z-index: 0;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;

    li {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      box-sizing: border-box;
      background: $main_color;

      & ~ li {
        margin-left: 10px;
      }

      &:hover {
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }

  @include mq-down(md) {
    &__inner,
    &__list {
      max-width: 100%;
      padding: 0 get_vw(10);
      box-sizing: border-box;
    }

    &__name {
      padding-top: get_vw(20);
      height: get_vw(30);
    }

    &__description {
      max-width: 100%;
    }

    &__list {
      & ~ li {
        margin-left: get_vw(10);
      }
    }

    video {
      display: none;
    }
  }
}
</style>
