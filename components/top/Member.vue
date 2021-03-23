<template lang="pug">
.member
  .member__inner
    p#animate-svg.member__name
      MemberChoro(v-if='memberList[memberIndex].id === "choro"')
      MemberTetsu(v-if='memberList[memberIndex].id === "tetsu"')
      MemberPeko(v-if='memberList[memberIndex].id === "peko"')
      MemberSeto(v-if='memberList[memberIndex].id === "seto"')
      MemberPau(v-if='memberList[memberIndex].id === "pau"')
    p.member__class {{ memberList[memberIndex].class }}
    p.member__description {{ memberList[memberIndex].description }}
    video#video.video(autoplay, loop, muted)
      source(:src='memberList[memberIndex].video')
  ul.member__list
    li(
      v-for='(member, index) in memberList',
      :key='member.id',
      @click='test(index)'
    )
      img(:src='member.img')
</template>

<script>
import { Vue, Component } from 'nuxt-property-decorator'
import { TimelineMax, CSSPlugin } from 'gsap'
import $ from 'jquery'

@Component()
export default class Member extends Vue {
  data() {
    return {
      memberIndex: 0,
      memberList: [
        {
          id: 'choro',
          class: 'サイト管理者',
          description:
            'ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。',
          video: 'movie/pau.mp4',
          img: 'img/member_peko.png'
        },
        {
          id: 'tetsu',
          class: 'サイト管理者',
          description:
            'ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。',
          video: 'movie/pau.mp4',
          img: 'img/member_peko.png'
        },
        {
          id: 'peko',
          class: 'サイト管理者',
          description:
            'ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。',
          video: 'movie/pau.mp4',
          img: 'img/member_peko.png'
        },
        {
          id: 'seto',
          class: 'サイト管理者',
          description:
            'ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。',
          video: 'movie/pau.mp4',
          img: 'img/member_peko.png'
        },
        {
          id: 'pau',
          class: 'サイト管理者',
          description:
            'ウルダハの近衛兵団「銀冑団」の騎士たちは、忠誠を誓う王家を守るため、長い歴史の中で技を磨き上げてきた。白銀の甲冑で身を固め、大盾と騎士剣を手に戦いに身を投じる彼らは、剣術だけではなく護衛術にも長け、主君の命を断固として守り抜く。彼ら「ナイト」の戦技を学べば、鉄壁の守護者として戦場に君臨できることだろう。',
          video: 'movie/pau.mp4',
          img: 'img/member_peko.png'
        }
      ]
    }
  }

  test(i) {
    document.getElementById('animate-svg').style.opacity = 0
    this.memberIndex = i
    setTimeout(() => {
      this.svgAnimation()
      document.getElementById('animate-svg').style.opacity = 1
      document.getElementById('video').play()
    }, 500)
  }

  svgAnimation() {
    const tmaxOptionsGlobal = {
      yoyo: true
    }

    CSSPlugin.useSVGTransformAttr = true

    const tl = new TimelineMax(tmaxOptionsGlobal)
    const path = '#animate-svg svg *'
    const staggerVal = 0.0125
    const duration = 3

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

    const $svg = $('#animate-svg svg')
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

  activated() {
    this.svgAnimation()
    document.getElementById('video').play()
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
    padding: 0 50px;
    position: relative;
    margin: 0 auto;
    z-index: 10;
    box-sizing: border-box;

    > *:not(.video) {
      position: relative;
      z-index: 10;
    }
  }

  &__name {
    height: 50px;
    padding-top: 30px;

    svg {
      height: 100%;
      path {
        fill: $main_color;
      }
    }
  }

  &__class {
    font-size: 1rem;
    color: $gold;
    margin-top: 10px;
  }

  &__description {
    max-width: 400px;
    font-size: 1rem;
    line-height: 1.5;
    margin-top: 20px;
  }

  video {
    width: 1500px;
    position: absolute;
    right: -600px;
    top: -100px;
    bottom: 0;
    z-index: 0;
    margin: auto;
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
      padding-top: get_vw(10);
      height: get_vw(40);
    }

    &__class {
      margin-top: get_vw(15);
    }

    &__description {
      max-width: 100%;
      margin-top: get_vw(15);
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
