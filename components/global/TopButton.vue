<template lang="pug">
p.button
  NuxtLink.active-link(:to="`/${buttonId}`") トップへ戻る
</template>

<script>
export default {
  props: {
    buttonId: {
      default: '',
      type: String,
    },
  },
}
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
    color: $black;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
    border: 0 solid;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
    outline: 1px solid;
    text-shadow: none;
    margin: 0 auto;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      border: 1px solid;
      outline-color: rgba(255, 255, 255, 0);
      outline-offset: 15px;
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
