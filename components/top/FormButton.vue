<template lang="pug">
#ballon-wrap.ballon-wrap
  .ballon
    | リリース記念
    Popper
    br
    | 今なら下記フォームから体験入団した方に
    br
    | 「先着3名」個室と家具をプレゼント！
  .apply(@click='openForm')
    | 体験入団
    br
    | 申し込む
</template>

<script>
import Popper from '~/components/svg/Popper.vue'
export default {
  components: {
    Popper,
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
      console.log('FormEvent')
      const endBotton =
        document.getElementsByTagName('footer')[0].getBoundingClientRect()
          .bottom - window.innerHeight
      if (endBotton <= 1) {
        this.$el.classList.add('on')
      } else {
        this.$el.classList.remove('on')
      }
    },
    openForm() {
      document.getElementById('form').style.opacity = 1
      document.getElementById('form').style.zIndex = 100
    },
  },
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
  width: 400px;
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
  background: $red;
  box-sizing: border-box;
  text-align: center;
  border-radius: 5px;
  svg {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    position: relative;
    top: -3px;
  }
  &::before {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    border: 12px solid transparent;
    border-top: 12px solid $red;
    z-index: 2;
  }
  @include mq-down(md) {
    width: get_vw(280);
    font-size: get_vw(10);
    padding: get_vw(10) 0;
    bottom: get_vw(90);
    &::before {
      bottom: get_vw(-24);
      border: get_vw(12) solid transparent;
      border-top: get_vw(12) solid $red;
    }
  }
}
.apply {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
  color: $white;
  background: $red;
  box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
  &:hover {
    cursor: pointer;
  }
  @include mq-down(md) {
    width: get_vw(80);
    height: get_vw(80);
    font-size: get_vw(10);
    border: 2px solid $red;
    bottom: get_vw(5);
  }
}
@keyframes pulse {
  0% {
    transform: (scale(0.9));
  }
  70% {
    transform: (scale(1));
    box-shadow: 0 0 0 50px rgba($red, 0);
  }
  100% {
    transform: (scale(0.9));
    box-shadow: 0 0 0 0 rgba($red, 0);
  }
}
</style>
