<template lang="pug">
#ballon-wrap.ballon-wrap
  .ballon(v-html='title')
  .apply(@click='openAbout')
</template>

<script>
import Popper from '~/components/svg/Popper.vue'
export default {
  components: {
    Popper
  },
  props: {
    title: {
      default: '',
      type: String
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
        document.getElementsByTagName('footer')[0].getBoundingClientRect()
          .bottom - window.innerHeight
      if (
        endBotton <=
        document.getElementsByTagName('footer')[0].getBoundingClientRect()
          .height
      ) {
        this.$el.classList.add('on')
      } else {
        this.$el.classList.remove('on')
      }
    },
    openAbout() {
      document.getElementById('about').style.display = 'block'
    }
  }
}
</script>

<style lang="scss" scoped>
.ballon-wrap {
  transition: 0.5s;
  position: absolute;
  z-index: 50;
  &.on {
    opacity: 0;
    pointer-events: none;
  }
}
.ballon {
  width: 300px;
  padding: 15px 0;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5;
  color: $white;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 190px;
  margin: auto;
  background: $gold;
  box-sizing: border-box;
  text-align: center;
  border-radius: 5px;
  &::before {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    border: 12px solid transparent;
    border-top: 12px solid $gold;
    z-index: 2;
  }
  @include mq-down(md) {
    width: 60%;
    font-size: get_vw(12);
    padding: get_vw(10) 0;
    bottom: get_vw(90);
    &::before {
      bottom: get_vw(-24);
      border: get_vw(12) solid transparent;
      border-top: get_vw(12) solid $gold;
    }
  }
}
.apply {
  width: 130px;
  height: 130px;
  box-sizing: border-box;
  border-radius: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: bold;
  margin: auto;
  border: 4px solid $gold;
  background: url(~assets/img/about.png);
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
  @include mq-down(md) {
    width: get_vw(80);
    height: get_vw(80);
    font-size: get_vw(10);
    border: 2px solid $gold;
    bottom: get_vw(5);
  }
}
</style>
