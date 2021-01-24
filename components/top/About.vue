<template lang="pug">
#about.about(ref="about")
  section
    h3(v-html='pageSingle.title.rendered')
    .about__contents(v-html='pageSingle.content.rendered')
    .about__close(@click="closePopup") 閉じる
</template>

<script>
export default {
  props: {
    pageSingle: {
      default: () => {},
      type: Object,
    },
  },
  methods: {
    closePopup() {
      this.$refs.about.style.display = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.about {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  padding: 50px 0;
  h3 {
    font-size: 3rem;
    font-weight: bold;
    color: $gold;
    text-align: center;
  }
  &__contents {
    width: 90%;
    height: 60vh;
    z-index: 10;
    margin: 0 auto;
    background: $white;
    border-radius: 10px;
    border: 4px solid $gold;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    font-size: 18px;
    line-height: 1.5;
    margin-top: 30px;
  }
  &__close {
    width: 100px;
    height: 100px;
    font-size: 18px;
    font-weight: bold;
    line-height: 100px;
    text-align: center;
    border-radius: 100%;
    margin: 50px auto 0;
    background: $gold;
    color: $white;
    &:hover {
      cursor: pointer;
    }
  }
  @include mq-down(md) {
    padding: get_vw(30) 0;
    h3 {
      font-size: get_vw(20);
    }
    &__contents {
      font-size: get_vw(14);
      margin-top: get_vw(20);
    }
    &__close {
      width: get_vw(70);
      height: get_vw(70);
      line-height: get_vw(70);
      font-size: get_vw(14);
      margin-top: get_vw(20);
    }
  }
}
</style>
